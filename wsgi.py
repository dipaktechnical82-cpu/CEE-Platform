"""
Root WSGI entrypoint for CEE Platform.
Redirects to the Django application in apps/api.
"""
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
API_DIR = os.path.join(BASE_DIR, 'apps', 'api')

if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

from config.wsgi import application
