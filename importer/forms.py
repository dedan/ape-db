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

import data_sheet

DATA_FILE_NAME = 'Merge R+R+N+A+P NEW.xlsx'
PER_PAGE_VARIABLES = ['source', 'pg#', 'entry#', 'dataENTRYdate', 'dataENTRYperson']


def get_form_for_sheet(form_name, form_sheet, definitions):
    form_variables = form_sheet.columns[len(PER_PAGE_VARIABLES):]
    missing_definitions = set(form_variables) - set(definitions)
    if missing_definitions:
        print('⚠️   Definitions missing for {} {}'.format(form_name, missing_definitions))
        print('     ==> Dropping those columns!')
    form_variables = [v for v in form_variables if v in definitions]

    return {
        'type': 'object',
        'title': form_name,
        'properties': OrderedDict({
            var: {
                '$ref': '#/definitions/' + var
            } for var in form_variables
        })
    }


if __name__ == '__main__':
    if not len(sys.argv) > 1:
        print('⚠️    Output folder missing')
        print(__doc__)
        sys.exit(1)
    forms_path = sys.argv[1]

    definitions_path = path.join(forms_path, 'definitions.json')
    if not path.exists(definitions_path):
        print('⚠️    Definitions file missing')
        print('Please first create definitions.json by running index.py')
        sys.exit(1)
    definitions = json.load(open(definitions_path))

    script_path = path.dirname(path.realpath(__file__))
    sheet_path = path.join(script_path, '..', 'data', DATA_FILE_NAME)
    all_sheets = pd.read_excel(sheet_path, sheetname=None)

    all_form_names = list(all_sheets.keys() - ['INDEX'])
    for form_name in tqdm(all_form_names):
        form_sheet = data_sheet.read_form_sheet(sheet_path, all_sheets, form_name)
        form = get_form_for_sheet(form_name, form_sheet, definitions)
        with open(path.join(forms_path, form_name + '.json'), 'w') as f:
            json.dump(form, f)
