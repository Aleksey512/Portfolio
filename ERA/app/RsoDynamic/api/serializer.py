from rest_framework import serializers

from RsoDynamic.models import *


class SmenaSerializer(serializers.ModelSerializer):
    dynamic_settings = serializers.HyperlinkedRelatedField(
        view_name="dynamicsettings-detail",
        many=True,
        read_only=True,
    )
    chlorine = serializers.HyperlinkedRelatedField(
        view_name="chlorine-detail",
        many=True,
        read_only=True,
    )
    operational_information = serializers.HyperlinkedRelatedField(
        view_name="operationalinformation-detail",
        many=True,
        read_only=True,
    )
    dynamic_every_hour = serializers.BooleanField(read_only=True,
                                                  help_text='True - если вовремя ввели, false - если не вовремя',)
    chlorine_every_hour = serializers.BooleanField(read_only=True,
                                                   help_text='True - если вовремя ввели, false - если не вовремя',)

    class Meta:
        model = Smena
        exclude = ('user',)


class DynamicSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicSettings
        fields = "__all__"


class ChlorineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chlorine
        fields = "__all__"


class OperationalInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationalInformation
        fields = "__all__"
