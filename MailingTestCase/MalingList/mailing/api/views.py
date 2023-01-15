from rest_framework import viewsets
from rest_framework import mixins

from mailing.api.serializers import *


class BaseModelMixin(mixins.ListModelMixin,
                     mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    pass


class ClientAPIView(BaseModelMixin):
    queryset = Client.objects.all()
    serializer_class = ClientSerialzier


class MessageAPIView(BaseModelMixin):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class MailingAPIView(BaseModelMixin):
    queryset = Mailing.objects.all()
    serializer_class = MailingSerializer

