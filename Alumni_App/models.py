from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
import json
from autoslug import AutoSlugField
from django.conf import settings


class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30, null=True)
    last_name = models.CharField(max_length=30, null=True)
    USER_TYPES = [
        ("alumni", "Alumni"),
        ("teacher", "Teacher"),
        ("student", "Student"),
    ]
    email = models.EmailField(unique=True, null=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, null=True)
    phone = models.CharField(max_length=15, unique=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )
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
        if not self.student_id and self.user_type == "student":
            self.student_id = str(uuid.uuid4())[:10]
        elif not self.alumni_id and self.user_type == "alumni":
            self.alumni_id = str(uuid.uuid4())[:10]
        elif not self.teacher_id and self.user_type == "teacher":
            self.teacher_id = str(uuid.uuid4())[:10]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

    def friends(self):
        accepted_from = FriendRequest.objects.filter(
            from_user=self, status="accepted"
        ).values_list("to_user", flat=True)
        accepted_to = FriendRequest.objects.filter(
            to_user=self, status="accepted"
        ).values_list("from_user", flat=True)
        return CustomUser.objects.filter(id__in=list(accepted_from) + list(accepted_to))


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
    branch = models.CharField(
        max_length=100,
        choices=[
            ("CSE", "Computer Science and Engineering"),
            ("ECE", "Electronics Engineering"),
            ("EE", "Electrical Engineering"),
        ],
    )
    enrollment_number = models.CharField(max_length=15, unique=True, null=True)

    def __str__(self):
        return self.user.email




class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    link = models.URLField(max_length=300, blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)
    slug = AutoSlugField(populate_from="title", unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return self.title


class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    blog_image = models.ImageField(upload_to="blog_images/", blank=True, null=True)
    blog_details = models.TextField(default=list, blank=True, null=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    slug = AutoSlugField(populate_from="title", unique=True, null=True, blank=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.title


class FriendRequest(models.Model):
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="sent_requests", on_delete=models.CASCADE
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="received_requests",
        on_delete=models.CASCADE,
    )
    status = models.CharField(
        max_length=10,
        choices=[
            ("pending", "Pending"),
            ("accepted", "Accepted"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("from_user", "to_user")  # prevent duplicates

    def __str__(self):
        return f"{self.from_user} → {self.to_user} ({self.status})"


class Notifications(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    notification = models.TextField(max_length=100)
    is_sent = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        super(Notifications, self).save(*args, **kwargs)

        channel_layer = get_channel_layer()
        notification_count = Notifications.objects.filter(is_sent=False).count()
        data = {
            "count": notification_count,
            "current_notification": self.notification,
        }
        async_to_sync(channel_layer.group_send)(
            "notification_group_consumer",
            {"type": "send_notification", "value": json.dumps(data)},
        )

        if not self.is_sent:
            self.is_sent = True
            super(Notifications, self).save(update_fields=["is_sent"])
