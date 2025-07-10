import django.contrib
import django.dispatch
from django.shortcuts import render, get_object_or_404, redirect
from Alumni_App.models import *
from django.contrib.auth.models import User
from .models import Community, Messages
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils.timezone import now
from datetime import timedelta


def mainPage(request):
    users = CustomUser.objects.all().exclude(id=request.user.id)
    chat_user = None
    return render(
        request, "Alumni_Chat/Templates/master.html", {"users": users, "chat_user": chat_user, "chat": True}
    )


def chat(request, username):
    receiver = CustomUser.objects.get(username=username)
    messages = Messages.objects.filter(
        sender__in=[request.user, receiver], receiver__in=[request.user, receiver]
    )
    users = CustomUser.objects.exclude(id=request.user.id)

    return render(
        request,
        "Alumni_Chat/Templates/master.html",
        {
            "receiver": receiver,
            "selected_user": receiver,
            "messages": messages,
            "users": users,
        },
    )


def community_page(request):
    communities = Community.objects.all()
    selected_id = request.GET.get("id")
    selected_community = None

    if selected_id:
        selected_community = get_object_or_404(Community, id=selected_id)

    return render(
        request,
        "Alumni_Chat/Templates/pages/community.html",
        {
            "communities": communities,
            "selected_community": selected_community,
        },
    )


# Settings Page
def settings(request):
    return render(request, "Alumni_Chat/Templates/pages/settings.html")


# Notifications Pannel
@login_required
def notifications(request):
    user = request.user
    recent_time = now() - timedelta(hours=24)

    # for new Blogs
    blogs = Blog.objects.filter(created_at=recent_time)
    blog_notifications = [
        {
            "type": "blog",
            "message": f"📢 New blog posted: {b.title}",
            "timestamp": b.created_at.strftime("%Y-%m-%d %H:%M"),
            "url": f"/blogs/{b.slug}/",
        }
        for b in blogs
    ]

    # for new Events
    events = Event.objects.filter(created_at__gte=recent_time)
    event_notifications = [
        {
            "type": "event",
            "message": f"🎉 New event: {e.title}",
            "timestamp": e.created_at.strftime("%Y-%m-%d %H:%M"),
            "url": f"/events/",
        }
        for e in events
    ]

    # for new Friends Requests
    friend_requests = FriendRequest.objects.filter(
        to_user=user, status="pending", timestamp__gte=recent_time
    )
    friend_notifications = [
        {
            "type": "friend_request",
            "message": f"👤 {fr.from_user.get_full_name()} sent you a friend request.",
            "timestamp": fr.created_at.strftime("%Y-%m-%d %H:%M"),
            "url": "/friends/",
        }
        for fr in friend_requests
    ]

    # for new Messages
    friend_messages = Messages.objects.filter(
        receiver=user, is_read=False, timestamp__gte=recent_time
    )
    message_notifications = [
        {
            "type": "chat_message",
            "message": f"💬 New message from {msg.sender.get_full_name()}",
            "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M"),
            "url": "/alumni_chat/",
        }
        for msg in friend_messages
    ]

    # for Community Messages
    # community_messages = CommunityMessage.objects.filter(timestamp__gte=recent_time).exclude(sender=user)
    # community_notifications = [
    #     {
    #         'type': 'community',
    #         'message': f"📣 New message in {cm.community.name}",
    #         'timestamp': cm.timestamp.strftime("%Y-%m-%d %H:%M"),
    #         'url': f"/communities/{cm.community.id}/"
    #     } for cm in community_messages
    # ]

    # # Merge all
    # notifications = blog_notifications + event_notifications + friend_notifications + message_notifications + community_notifications
    notifications = (
        blog_notifications
        + event_notifications
        + friend_notifications
        + message_notifications
    )
    notifications.sort(key=lambda n: n["timestamp"], reverse=True)
    return JsonResponse({"notifications": notifications})


def saveMessage(request):
    if request.method == "POST":
        sender = request.User
        receiver = request.POST.get("receiver")
        content = request.POST.get("content")
        timestamp = now()
        message = Messages.objects.create(
            sender=sender, receiver=receiver, content=content, timestamp=timestamp
        )
        return JsonResponse({"status": "success"})


def getMessages(request, username):
    receiver = CustomUser.objects.get(username=username)
    messages = Messages.objects.filter(
        sender__in=[request.user, receiver], receiver__in=[request.user, receiver]
    ).order_by("timestamp")
    
    return JsonResponse(
        {
            "messages": [
                {
                    "sender": msg.sender.username,
                    "receiver": msg.receiver.username,
                    "content": msg.content,
                    "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M"),
                }
                for msg in messages
            ]
        }
    )