from channels.generic.websocket import (
    AsyncJsonWebsocketConsumer,
    AsyncWebsocketConsumer,
)
from django.core.serializers import serialize
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from Alumni_App.views import CustomUser
from .models import Notifications
from Alumni_Chat.models import Messages
import json
from pytz import timezone

IST = timezone("Asia/Kolkata")

ONLINE_USERS = set()


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


ONLINE_USERS = set()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender = self.scope["user"]
        self.receiver_username = self.scope["url_route"]["kwargs"]["username"]
        self.receiver = await database_sync_to_async(CustomUser.objects.get)(
            username=self.receiver_username
        )

        self.room_name = f"{min(self.sender.id, self.receiver.id)}_{max(self.sender.id, self.receiver.id)}"
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        ONLINE_USERS.add(self.sender.id)

        unseen = await self.get_unseen_messages(self.sender.id, self.receiver.id)
        for msg in unseen:
            await self.send(
                text_data=json.dumps(
                    {
                        "message": msg["content"],
                        "sender": msg["sender__username"],
                        "timestamp": msg["timestamp"].strftime("%H:%M"),
                    }
                )
            )
            await self.mark_seen_by_id(msg["id"])

    async def disconnect(self, *args, **kwargs):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        ONLINE_USERS.discard(self.sender.id)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]

        msg = await self.save_message(self.sender, self.receiver, message)
        timestamp = msg.timestamp.astimezone(IST).strftime("%I:%M %p")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": self.sender.username,
                "timestamp": timestamp,
            },
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "sender": event["sender"],
                    "timestamp": event["timestamp"],
                }
            )
        )

    @database_sync_to_async
    def save_message(self, sender, receiver, message):
        return Messages.objects.create(
            sender=sender, receiver=receiver, content=message, is_seen=False
        )

    @database_sync_to_async
    def get_unseen_messages(self, receiver_id, sender_id):
        return list(
            Messages.objects.filter(
                receiver_id=receiver_id, sender_id=sender_id, is_seen=False
            )
            .select_related("sender")
            .values("id", "content", "sender__username", "timestamp")
        )

    @database_sync_to_async
    def mark_seen_by_id(self, msg_id):
        Messages.objects.filter(id=msg_id).update(is_seen=True)
