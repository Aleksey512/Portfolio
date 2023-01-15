from rest_framework import serializers

from Fare.models import FareData


class FareDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FareData
        fields = "__all__"

