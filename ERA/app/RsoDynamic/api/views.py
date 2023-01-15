from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import mixins
from rest_framework import viewsets
from rest_framework.response import Response

from RsoDynamic.api.serializer import *

from core.permissions import IsAdminOrReadOnly

import datetime


class BaseViewSet(mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.CreateModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    """
    Basic view model
    """
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'destroy':
            permission_classes = [IsAdminOrReadOnly]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class SmenaAPIViewSet(BaseViewSet):
    """
    Представляет смену
    """
    def get_queryset(self):
        return Smena.objects.all()

    serializer_class = SmenaSerializer

    def list(self, request, *args, **kwargs):
        user_info = User.objects.get(id=self.request.user.id)
        queryset = Smena.objects.filter(user_id=user_info.id).filter(flag_complete=False)
        context = {
            'request': request
        }
        serializer = SmenaSerializer(queryset, context=context, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        user_info = User.objects.get(id=self.request.user.id)
        return serializer.save(user_id=user_info.id)


class DynamicSettingsAPIViewSet(BaseViewSet):
    queryset = DynamicSettings.objects.all()
    serializer_class = DynamicSettingsSerializer


class ChlorineAPIViewSet(BaseViewSet):
    queryset = Chlorine.objects.all()
    serializer_class = ChlorineSerializer


class OperationalInformationAPIViewSet(BaseViewSet):
    queryset = OperationalInformation.objects.all()
    serializer_class = OperationalInformationSerializer
