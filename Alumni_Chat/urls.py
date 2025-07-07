from django.urls import path
from Alumni_Chat import views

urlpatterns = [
    # Communities
    path("communities/", views.community_page, name="Communities"),
    # Settings
    path("settings/", views.settings, name="Settings"),
    # Chats
    path("", views.mainPage, name="ChatHome"),
    path("chat/<str:username>/", views.chat, name="chat_room"),
    # Notifications
    path("notifications/", views.notifications, name="notifications"),
]
