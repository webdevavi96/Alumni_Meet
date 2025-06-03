from django.test import TestCase, Client
from django.urls import reverse
from django.core import mail
from django.contrib.auth import get_user_model
from .models import CustomUser, Student

class SignUpViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('signUp')
        self.valid_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john@example.com',
            'phone': '1234567890',
            'user_type': 'student',
            'branch': 'CSE',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
        }

    def test_signup_get(self):
        response = self.client.get(self.signup_url)
        self.assertEqual(response.status_code, 200)

    def test_signup_post_valid(self):
        response = self.client.post(self.signup_url, data=self.valid_data)
        self.assertRedirects(response, reverse('verify_otp'))
        self.assertIn('temp_user', self.client.session)
        self.assertEqual(len(mail.outbox), 1)

    def test_signup_post_existing_email(self):
        CustomUser.objects.create_user(username='existing', email='john@example.com', password='pass')
        response = self.client.post(self.signup_url, data=self.valid_data)
        self.assertContains(response, "Email already registered.")

class CustomUserTest(TestCase):
    def test_user_id_generation(self):
        student = CustomUser.objects.create_user(username='stu', email='stu@x.com', user_type='student')
        self.assertIsNotNone(student.student_id)
        
def test_signup_post_password_mismatch(self):
    invalid_data = self.valid_data.copy()
    invalid_data['confirm_password'] = 'differentpass'
    response = self.client.post(self.signup_url, data=invalid_data)
    self.assertContains(response, "Passwords do not match")

def test_signup_post_invalid_email(self):
    invalid_data = self.valid_data.copy()
    invalid_data['email'] = 'invalid-email'
    response = self.client.post(self.signup_url, data=invalid_data)
    self.assertContains(response, "Enter a valid email address")


def test_student_profile_created(self):
    self.client.post(self.signup_url, data=self.valid_data)
    user = CustomUser.objects.get(email=self.valid_data['email'])
    self.assertTrue(Student.objects.filter(user=user).exists())


def test_otp_email_content(self):
    self.client.post(self.signup_url, data=self.valid_data)
    email = mail.outbox[0]
    self.assertIn('Your OTP code', email.subject)
    self.assertIn(self.valid_data['email'], email.to)



