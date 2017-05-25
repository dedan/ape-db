"""
Script to export the form schemata from the Excel file I got from Noelle.

Usage:
    python forms.py /path/to/folder/where/you/want/the/forms
"""
from collections import OrderedDict
import json
from os import path
import sys

import pandas as pd
from tqdm import tqdm

DATA_FILE_NAME = 'OU.OrangutanName.S.1.2017.xls'
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
    if not len(sys.argv) > 1:
        print('⚠️    Output folder missing')
        print(__doc__)
        sys.exit(1)

    forms_path = sys.argv[1]
    script_path = path.dirname(path.realpath(__file__))
    sheet_path =  path.join(script_path, '..', 'data', DATA_FILE_NAME)
    all_sheets = pd.read_excel(sheet_path, sheetname=None)

    all_form_names = list(all_sheets.keys() - ['INDEX'])
    for form_name in tqdm(all_form_names):
        form_sheet = read_form_sheet(sheet_path, all_sheets, form_name)
        form = get_form_for_sheet(form_name, form_sheet)
        with open(path.join(forms_path, form_name + '.json'), 'w') as f:
            json.dump(form, f)
