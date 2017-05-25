"""
Script to export the entries from the Excel file I got from Noelle.

Usage:
    python forms.py /path/to/catalog /path/to/forms

    Catalog: This is the path you later have to point the application to.
    Forms: This is where you created definitions.json using index.py.
"""
import json
import os
from os import path
import sys
import re

import pandas as pd
from tqdm import tqdm

import data_sheet


DATA_FILE_NAME = 'Merge R+R+N+A+P NEW.xlsx'


def _export_form_sheet(form_sheet, catalog_path):
    entry_columns = form_sheet.columns[3:]
    for index, row in form_sheet.iterrows():
        try:
            # TODO: Validate against regex.
            book = row.source.split('_')[0].upper()
            page = _parse_page_string(row['pg#'])
            entry = str(row['entry#'])
            entryFileName = '{}_{}.json'.format(entry, form_name)
            entry_path = path.join(catalog_path, book, page, entryFileName)
            os.makedirs(path.dirname(entry_path), exist_ok=True)
            # TODO: Validate with shema before writing.
            with open(entry_path, 'w') as f:
                json_entry = row[entry_columns].to_json(date_format='iso')
                f.write(json_entry)
        except Exception:
            print(form_name)
            if 'pgQ' in row:
                print('Wrong page column name')
            else:
                print('Invalid Entry (book: {}, page: {}, entry: {})'.format(
                    row['book'], row['pg#'], row['entry#']))


page_pattern = re.compile('(\d+)(\w?)')


def _parse_page_string(page_string):
    match = page_pattern.match(str(page_string))
    page_number = int(match.group(1))
    page_char = match.group(2)
    return 'p{0:03d}{1:}'.format(page_number, page_char)


if __name__ == '__main__':
    if not len(sys.argv) > 2:
        print('⚠️    Output folders missing')
        print(__doc__)
        sys.exit(1)
    catalog_path = sys.argv[1]
    forms_path = sys.argv[2]

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
        _export_form_sheet(form_sheet, catalog_path)
