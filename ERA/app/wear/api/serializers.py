from rest_framework import serializers

from wear.models import WearData

class WearDetailSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = WearData
        fields = "__all__"