from django.db import models
from django.conf import settings
from Alumni_App.models import CustomUser
import django.dispatch


class Community(models.Model):
    community_name = models.CharField(max_length=50)
    community_id = models.CharField(max_length=10, unique=True, null=True, blank=True)
    community_image = models.ImageField(
        upload_to="community_image/", blank=True, null=True
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return self.community_name


class Messages(models.Model):
    sender = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)
    
    class Meta:
        ordering = ["timestamp"]