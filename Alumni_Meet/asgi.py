"""
ASGI config for Alumni_Meet project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Alumni_Meet.settings")


from channels.routing import ProtocolTypeRouter, URLRouter
from Alumni_App.consumers import *
from django.urls import re_path
from channels.auth import AuthMiddlewareStack


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            re_path(r"^ws/notifications/$", NotificationConsumer.as_asgi()),
            re_path(r"^ws/chat/(?P<username>[^/]+)/$", ChatConsumer.as_asgi()),
        ])
    ),
})