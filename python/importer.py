import pandas as pd
import json


def get_index_from_sheet(sheet):
    index = all_sheets['INDEX']
    cols_to_use = [
        'Data variable as written on entry form',
        'Excel column header',
        'Data values as written on entry form',
        'Data values to enter into excel',
        'Which forms?',
    ]
    cols_to_join = ['Data variable as written on entry form', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3']
    def joiner(row):
        bla = [s for s in row if isinstance(s, str) and s]
        return ' - '.join(bla) if bla else row.iloc[0]
    index['Data variable as written on entry form'] = index[cols_to_join].apply(joiner, axis=1)

    index = index[cols_to_use].reset_index()
    index.columns = ['group', 'form_variable', 'variable', 'form_value', 'value', 'used_on']
    index.fillna(method='pad', inplace=True)
    return index


def get_definitions_from_index(index):
    definitions = index.groupby('variable').apply(_grouper)
    definitions = definitions.reset_index(name='type_def')
    # TODO: Why do we have duplicates?
    definitions = definitions.drop_duplicates(subset=['variable'])
    return {
        row.variable: row.type_def
        for (index, row) in definitions.iterrows()
    }


def _grouper(g):
    if set(g.value) == set(['[as written]', 'Ø']):
        return {
            'title': str(g.form_variable.iloc[0]),
            'type': 'string',
            'minLength': 1,
        }
    else:
        return {
            'title': str(g.form_variable.iloc[0]),
            'enum': list(g.value),
            'enumNames': list(g.form_value),
            'type': 'string',
        }

if __name__ == '__main__':
    SHEET_PATH = '/Users/dedan/tmp/OU.OrangutanName.S.1.2017.xls'
    OUT_PATH = '/Users/dedan/projects/monkey-db/test/test-forms/definitions.json'
    all_sheets = pd.read_excel(SHEET_PATH, sheetname=None)
    index = get_index_from_sheet(all_sheets['INDEX'])
    definitions = get_definitions_from_index(index)
    with open(OUT_PATH, 'w') as f:
        json.dump(definitions, f, indent=2)
