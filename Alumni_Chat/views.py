from django.shortcuts import render, get_object_or_404
from Alumni_App.models import CustomUser, Event, Blog, FriendRequest
from .models import Community
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils.timezone import now
from datetime import timedelta


def mainPage(request):
    users = CustomUser.objects.all().exclude(id=request.user.id)
    chat_user = None
    return render(
        request, "master.html", {"users": users, "chat_user": chat_user, "chat": True}
    )


# Chat Detail View
def chat(request, user_id):
    users = CustomUser.objects.exclude(id=request.user.id)
    chat_user = get_object_or_404(CustomUser, id=user_id)

    return render(request, "master.html", {"users": users, "chat_user": chat_user})


def community_page(request):
    communities = Community.objects.all()
    selected_id = request.GET.get("id")
    selected_community = None

    if selected_id:
        selected_community = get_object_or_404(Community, id=selected_id)

    return render(
        request,
        "pages/community.html",
        {
            "communities": communities,
            "selected_community": selected_community,
        },
    )


# Settings Page
def settings(request):
    return render(request, "pages/settings.html")


# Notifications Pannel
@login_required
def notifications(request):
    user = request.user
    recent_time = now() - timedelta(hours=24)

    # for new Blogs
    blogs = Blog.objects.filter(created_at__gte=recent_time)
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

    # # for new Messages
    # friend_messages = Message.objects.filter(receiver=user, is_read=False, timestamp__gte=recent_time)
    # message_notifications = [
    #     {
    #         'type': 'chat_message',
    #         'message': f"💬 New message from {msg.sender.get_full_name()}",
    #         'timestamp': msg.timestamp.strftime("%Y-%m-%d %H:%M"),
    #         'url': "/alumni_chat/"
    #     } for msg in friend_messages
    # ]

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
    notifications = blog_notifications + event_notifications + friend_notifications
    notifications.sort(key=lambda n: n["timestamp"], reverse=True)
    return JsonResponse({"notifications": notifications})
