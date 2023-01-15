from django.urls import path
from . import views

urlpatterns = [
    path("test_json/", views.test_json, name="test_json"),
    path("test_excel/", views.test_excel, name="test_excel"),
    path("ui/", views.index, name="index"),
    path("chat/", views.test_channels, name="chat"),
    path("chat/<str:room_name>/", views.test_room, name="room"),
]
