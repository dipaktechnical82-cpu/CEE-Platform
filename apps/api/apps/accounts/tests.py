from django.contrib.auth import get_user_model
from django.test import TestCase

User = get_user_model()


class UserModelTest(TestCase):
    def test_create_student_user(self):
        user = User.objects.create_user(
            email='student@example.com',
            password='Password123#Strong',
            full_name='Aastha Sharma',
        )
        self.assertEqual(user.email, 'student@example.com')
        self.assertEqual(user.role, User.Role.STUDENT)
        self.assertTrue(user.check_password('Password123#Strong'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='AdminPassword123#',
        )
        self.assertEqual(admin_user.role, User.Role.SUPER_ADMIN)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
