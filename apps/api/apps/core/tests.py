from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from kombu.exceptions import OperationalError
from rest_framework import status
from rest_framework.test import APIClient


class CoreHealthCheckTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch('apps.core.views.celery_app.connection_for_read')
    def test_health_check_endpoint(self, connection_for_read):
        connection_for_read.return_value.__enter__.return_value.ensure_connection.return_value = None
        url = reverse('api-health')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['service'], 'nepal-cee-api')
        self.assertIn('checks', response.data['data'])
        self.assertIn('celery', response.data['data']['checks'])
        connection_for_read.assert_called_once()

    @patch(
        'apps.core.views.celery_app.connection_for_read',
        side_effect=OperationalError('broker unavailable'),
    )
    def test_health_check_reports_unavailable_celery_broker(self, connection_for_read):
        response = self.client.get(reverse('api-health'))

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertFalse(response.data['data']['checks']['celery'])
        connection_for_read.assert_called_once()
