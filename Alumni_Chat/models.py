from django.db import models
from django.conf import settings

class Community(models.Model):
    community_name = models.CharField(max_length=50)
    community_id = models.CharField(max_length=10, unique=True, null=True, blank=True)
    community_image = models.ImageField(upload_to='community_image/', blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.community_name
