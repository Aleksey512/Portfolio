from django.urls import path, include

from . import views

from .api.views import *
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'clients', ClientAPIView, basename='client')
router.register(r'messages', MessageAPIView, basename='message')
router.register(r'mailings', MailingAPIView, basename='mailing')

urlpatterns = [
    path('', views.HomeView.as_view(), name="Главная"),
]

urlpatterns += router.urls
