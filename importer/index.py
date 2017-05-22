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

def _get_mandatory_string(title):
    return {
        'title': title,
        'type': 'string',
        'minLength': 1,
    }

def _get_date_definition(title):
    return {
        'title': title,
        'type': 'string',
        'format': 'date'
    }

def _get_number_string_definition(title, number_string):
    return {
        'title': title,
        'type': 'string',
        'pattern': number_string.replace('#', '\d') + '|Ø'
    }

def _get_temperature_field(title):
    return {
        'title': title,
        'type': 'string',
        'pattern': '(\d+(\.\d+)?\w?[CF])|Ø',
    }

def _grouper(g):
    title = str(g.form_variable.iloc[0])
    first_value = g.value.iloc[0]
    # Text or notgiven
    if set(g.value) == set(['[as written]', 'Ø']):
        return _get_mandatory_string(title)
    # Name field
    elif len(g.value) == 1 and first_value == '[name]':
        return _get_mandatory_string(title)
    # Date field
    elif 'dd-MMM-yyyy' in list(g.value):
        return _get_date_definition(title)
    # Number fields
    elif '#' in first_value and not 'Temperature' in title:
        return _get_number_string_definition(title, first_value)
    # Temperature field
    elif 'Temperature' in title:
        return _get_temperature_field(title)
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


