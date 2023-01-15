from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ADS.models import *
from core.permissions import IsAdminOrReadOnly
from ADS.api.serializers import ApplicationSerializer


class ApplicationAPIList(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = (IsAuthenticated, )


class ApplicationAPIUpdate(generics.RetrieveUpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = (IsAuthenticated, )


class ApplicationAPIDestroy(generics.RetrieveDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = (IsAdminOrReadOnly, )
