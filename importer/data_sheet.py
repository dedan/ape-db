import pandas as pd


def read_form_sheet(spreadsheet_path, all_sheets, sheet_name):
    df = all_sheets[sheet_name]
    mask = df['Information about data Entry'] == 'book'
    header_index = df[mask].index[0] + 1
    return pd.read_excel(spreadsheet_path, sheetname=sheet_name, header=header_index)
