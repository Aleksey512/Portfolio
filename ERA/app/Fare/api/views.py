from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from Fare.models import FareData
from core.models import Profile
from core.permissions import IsAdminOrReadOnly
from Fare.api.serializers import FareDataSerializer


class FareDataAPIList(generics.ListCreateAPIView):
    def get_queryset(self):
        profile_info = Profile.objects.get(user=self.request.user.id)
        return FareData.objects.filter(manage_org=profile_info.manage_org)
    serializer_class = FareDataSerializer
    permission_classes = (IsAuthenticated, )


class FareDataAPIUpdate(generics.RetrieveUpdateAPIView):
    def get_queryset(self):
        profile_info = Profile.objects.get(user=self.request.user.id)
        return FareData.objects.filter(manage_org=profile_info.manage_org)
    serializer_class = FareDataSerializer
    permission_classes = (IsAuthenticated, )


class FareDataAPIDestroy(generics.RetrieveDestroyAPIView):
    queryset = FareData.objects.all()
    serializer_class = FareDataSerializer
    permission_classes = (IsAdminOrReadOnly, )
