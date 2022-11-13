from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from .consts import PROVINCES

def validate_province(value):
    if value not in PROVINCES:
        raise ValidationError(
            _('%(value) is not a valid Canadian province abbreviation'),
            params={'value': value},
        )