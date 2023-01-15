from django.urls import path
from era_gkh_bot.views import handle_bot_request, poll_updates

urlpatterns = [
    path('update/', handle_bot_request),
    path('poll/', poll_updates)
]
