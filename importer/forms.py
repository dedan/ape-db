import os
import json
from collections import OrderedDict

import pandas as pd

FORMS_PATH = '/Users/dedan/projects/monkey-db/test/test-forms/'
PER_PAGE_VARIABLES = ['source', 'pg#', 'entry#', 'dataENTRYdate', 'dataENTRYperson']

def get_form_for_sheet(form_name, form_sheet):
    form_variables = form_sheet.columns[len(PER_PAGE_VARIABLES):]
    return {
        'type': 'object',
        'title': form_name,
        'properties': OrderedDict({
            var: {
                '$ref': '#/definitions/' + var
            } for var in form_variables
        })
    }

def read_form_sheet(spreadsheet_path, all_sheets, sheet_name):
    df = all_sheets[sheet_name]
    mask = df['Information about data Entry'] == 'source'
    header_index = df[mask].index[0] + 1
    return pd.read_excel(spreadsheet_path, sheetname=sheet_name, header=header_index)


if __name__ == '__main__':
    SHEET_PATH = '/Users/dedan/tmp/OU.OrangutanName.S.1.2017.xls'
    all_sheets = pd.read_excel(SHEET_PATH, sheetname=None)

    all_form_names = list(all_sheets.keys() - ['INDEX'])
    for form_name in all_form_names:
        form_sheet = read_form_sheet(SHEET_PATH, all_sheets, form_name)
        form = get_form_for_sheet(form_name, form_sheet)
        with open(os.path.join(FORMS_PATH, form_name + '.json'), 'w') as f:
            json.dump(form, f)
