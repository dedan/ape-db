import pandas as pd
import json


def get_index_from_sheet(sheet):
    cols_to_use = [
        'Data variable as written on entry form',
        'Excel column header',
        'Data values as written on entry form',
        'Data values to enter into excel',
        'h',
    ]
    cols_to_join = [
        'Data variable as written on entry form',
        'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3'
    ]

    def joiner(row):
        bla = [s for s in row if isinstance(s, str) and s]
        return ' - '.join(bla) if bla else row.iloc[0]
    sheet['Data variable as written on entry form'] = sheet[cols_to_join].apply(joiner, axis=1)

    sheet = sheet[cols_to_use].reset_index()
    sheet.columns = ['group', 'form_variable', 'variable', 'form_value', 'value', 'used_on']
    # Drop all the lines with no values in the end of the file.
    sheet.dropna(subset=['value'], inplace=True)
    sheet.fillna(method='pad', inplace=True)
    return sheet


def get_definitions_from_index(index):
    definitions = index.groupby(['form_variable', 'variable']).apply(_grouper)
    definitions = definitions.reset_index(name='type_def')

    # Drop duplicates.
    variable_counts = definitions.variable.value_counts()
    duplicates = list(variable_counts[variable_counts > 1].index)
    if duplicates:
        print('⚠️  {} duplicated variables {}'.format(len(duplicates), duplicates))
        print(' ==> Dropping those variables!')
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


def _get_number_string_definition(title):
    return {
        'title': title,
        'type': 'number',
    }


def _get_temperature_definition(title):
    return {
        'title': title,
        'type': 'string',
        'pattern': '(\d+(\.\d+)?\w?[CF])|Ø',
    }


def _get_enum_definition(title, form_values, values):
    form_values, values = list(form_values), list(values)
    enum_names = [
        str(name) if name != '[as written]' else values[i]
        for i, name in enumerate(form_values)]
    enum_type = 'optionalEnum' if '[as written]' in values else 'enum'
    return {
        'title': title,
        enum_type: values,
        enum_type + 'Names': enum_names,
        'type': 'string',
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
    elif '#' in first_value and ':' not in first_value and 'Temperature' not in title:
        return _get_number_string_definition(title)
    # Temperature field
    elif 'Temperature' in title:
        return _get_temperature_definition(title)
    else:
        return _get_enum_definition(title, g.form_value, g.value)


if __name__ == '__main__':
    SHEET_PATH = '/Users/dedan/projects/monkey-db/data/Merge R+R+N+A+P NEW.xlsx'
    OUT_PATH = '/Users/dedan/projects/monkey-db/test/test-forms/definitions.json'
    all_sheets = pd.read_excel(SHEET_PATH, sheetname=None)
    index = get_index_from_sheet(all_sheets['INDEX'])
    definitions = get_definitions_from_index(index)
    with open(OUT_PATH, 'w') as f:
        json.dump(definitions, f, indent=2)
