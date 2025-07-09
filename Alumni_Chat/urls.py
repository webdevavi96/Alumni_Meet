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
    path("save_message/", views.saveMessage, name="save_message"),
    path("get_messages/", views.getMessages, name="get_messages"),
    # Notifications
    path("notifications/", views.notifications, name="notifications"),
    
]
