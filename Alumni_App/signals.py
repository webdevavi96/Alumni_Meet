# notifications/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notifications
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json

@receiver(post_save, sender=Notifications)
def send_notification_on_create(sender, instance, created, **kwargs):
    if created and not instance.is_sent:
        channel_layer = get_channel_layer()
        data = {
            "count": Notifications.objects.filter(is_sent=False).count(),
            "current_notification": instance.notification,
        }

        async_to_sync(channel_layer.group_send)(
            "notification_group_consumer",
            {
                "type": "send_notification",
                "value": json.dumps(data),
            }
        )

        instance.is_sent = True
        instance.save(update_fields=["is_sent"])
