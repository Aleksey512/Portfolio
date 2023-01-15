import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import test.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ERA.settings")

ERA_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": ERA_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            test.routing.websocket_urlpatterns
        )
    ),
})
