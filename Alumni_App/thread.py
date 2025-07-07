from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notifications
import threading
import json

class NotificationThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        try:
            channel_layer = get_channel_layer()
            count = Notifications.objects.filter(is_sent=False).count()
            latest_notification = Notifications.objects.filter(is_sent=False).last()
            
            if latest_notification:
                data = {
                    "count": count,
                    "current_notification": latest_notification.notification,
                }

                async_to_sync(channel_layer.group_send)(
                    "notification_group_consumer",
                    {
                        "type": "send_notification",
                        "value": json.dumps(data),
                    },
                )

              
                latest_notification.is_sent = True
                latest_notification.save()

        except Exception as e:
            print(f"Error in NotificationThread: {e}")
