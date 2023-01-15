from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer

from mailing.models import *


class ClientSerialzier(serializers.ModelSerializer):

    class Meta:
        model = Client
        fields = '__all__'
        extra_kwargs = {
            'phone_number': {
                'help_text': 'Format: +7-999-888-77-66'
            },
            'mobile_operator_code': {
                'help_text': 'MinValue = 1, MaxValue = 999'
            },
            'tag': {
                'help_text': 'Max 15 digits'
            }
        }


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ("client_id", "mailing_id", "datetime", "status", "text", "pk")


class MailingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mailing
        fields = ("datetime_start", "datetime_end", "client_tag", "client_mobile_operator_code", "message_text", "pk",
                  "in_active")
