import re

ORIGINAL_IMAGE_RE = '^\w{2}\.\w+\.[MF]\.\d\.\d{4}_p\d{3}\w?$'
BOOK_RE = '^\w{2}\.\w+\.[MF]\.\d\.\d{4}$'
REPEATED_FIELD_RE = '.*_\d+$'


def get_repeated_field_variables(variables):
    return [v for v in variables if re.match(REPEATED_FIELD_RE, v)]
