from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from wear.models import *
from core.permissions import IsAdminOrReadOnly
from wear.api.serializers import WearDetailSerializer

