from channels.generic.websocket import AsyncJsonWebsocketConsumer, AsyncWebsocketConsumer
from django.core.serializers import serialize
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from Alumni_App.views import CustomUser
from .models import Notifications
from Alumni_Chat.models import Messages
import json


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = "notification_consumer"
        self.group_name = "notification_group_consumer"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        notifications = await self.get_unsent_notifications()
        await self.send_json(
            {"type": "initial_notification_list", "status": 200, "data": notifications}
        )

    @database_sync_to_async
    def get_unsent_notifications(self):
        return [
            {
                "id": n.id,
                "notification": n.notification,
                "user": n.user.get_full_name() if n.user else "Unknown",
                "user_id": n.user.id if n.user else None,
                "is_sent": n.is_sent,
            }
            for n in Notifications.objects.filter(is_sent=False)
        ]

    async def receive(self):
        await self.send(text_data=json.dumps({"status": "Received data"}))

    async def disconnect(self, *args, **kwargs):
        pass

    async def send_notification(self, event):
        data = json.loads(event.get("value"))
        await self.send_json({"type": "new_notification", "payload": data})



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender = self.scope["user"]
        self.receiver_username = self.scope["url_route"]["kwargs"]["username"]
        self.receiver = await database_sync_to_async(CustomUser.objects.get)(username=self.receiver_username)

        self.room_name = f"{min(self.sender.id, self.receiver.id)}_{max(self.sender.id, self.receiver.id)}"
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]

        msg = await self.save_message(self.sender, self.receiver, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": self.sender.username,
                "timestamp": msg.timestamp.strftime("%H:%M") 
            }
        )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "timestamp": event["timestamp"]
        }))
    @database_sync_to_async
    def save_message(self, sender, receiver, message):
        return Messages.objects.create(sender=sender, receiver=receiver, content=message)
