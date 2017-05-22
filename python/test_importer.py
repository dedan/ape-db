import pandas as pd
import importer

test_data = pd.DataFrame({
    'form_variable': ['Examiner', 'Examiner'],
    'variable': ['examiner', 'examiner'],
    'form_value': ['[as written]', '[blank]'],
    'value': ['[as written]', 'Ø'],
})

def test_text_field():
    definitions = importer.get_definitions_from_index(test_data)
    definition = definitions['examiner']
    assert definition['type'] == 'string'
    assert definition['minLength'] == 1
    assert not 'enum' in definition



