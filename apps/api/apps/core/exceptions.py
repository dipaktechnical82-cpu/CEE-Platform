from django.utils import timezone
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Custom exception handler that wraps all DRF error responses in a unified envelope:
    {
        "success": False,
        "error": {
            "code": str,
            "message": str,
            "details": dict | list | None,
            "timestamp": str
        }
    }
    """
    response = exception_handler(exc, context)

    if response is None:
        # Unhandled 500 error
        return None

    error_code = getattr(exc, 'default_code', 'API_ERROR').upper()
    error_message = 'An error occurred while processing the request.'

    if isinstance(exc, APIException):
        if isinstance(exc.detail, str):
            error_message = exc.detail
        elif isinstance(exc.detail, dict):
            error_message = 'Validation error occurred.'
        elif isinstance(exc.detail, list):
            error_message = 'Invalid input provided.'

    details = response.data

    response.data = {
        'success': False,
        'error': {
            'code': error_code,
            'message': error_message,
            'details': details,
            'timestamp': timezone.now().isoformat(),
        },
    }

    return response
