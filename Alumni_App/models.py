from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from autoslug import AutoSlugField


class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30, null=True)
    last_name = models.CharField(max_length=30, null=True)
    USER_TYPES = [
        ('alumni', 'Alumni'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    ]
    email = models.EmailField(unique=True, null=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, null=True)
    phone = models.CharField(max_length=15, unique=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    student_id = models.CharField(max_length=10, unique=True, null=True)
    alumni_id = models.CharField(max_length=10, unique=True, null=True)
    teacher_id = models.CharField(max_length=10, unique=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.student_id and self.user_type == 'student':
            self.student_id = str(uuid.uuid4())[:10]
        elif not self.alumni_id and self.user_type == 'alumni':
            self.alumni_id = str(uuid.uuid4())[:10]
        elif not self.teacher_id and self.user_type == 'teacher':
            self.teacher_id = str(uuid.uuid4())[:10]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class Alumni(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    def __str__(self):
        return self.user.email


class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.email


class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, default=1)
    branch = models.CharField(max_length=100, choices=[ 
        ('CSE', 'Computer Science and Engineering'), 
        ('ECE', 'Electronics Engineering'), 
        ('EE', 'Electrical Engineering'), 
    ])

    def __str__(self):
        return self.user.email


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    slug = AutoSlugField(populate_from='title', unique=True, null=True, blank=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)

    def save(self, *args, **kwargs):
        self.time = self.time.replace(second=0, microsecond=0)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    blog_image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    blog_details = models.TextField(default=list, blank=True, null=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    slug = AutoSlugField(populate_from='title', unique=True, null=True, blank=True)


    def __str__(self):
        return self.title