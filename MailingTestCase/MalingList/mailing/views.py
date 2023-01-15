
from django import forms
from django.shortcuts import render
from django.views import View
from django.contrib import messages

from .models import *

from .tasks import *


class MailingForm(forms.ModelForm):

    class Meta:
        model = Mailing
        fields = ("datetime_start", "datetime_end", "client_tag", "client_mobile_operator_code", "message_text",)
        widgets = {
            'datetime_start': forms.DateTimeInput(attrs={"class": "form-control"}),
            'datetime_end': forms.DateTimeInput(attrs={"class": "form-control"}),
            'client_tag': forms.TextInput(attrs={"class": "form-control"}),
            'client_mobile_operator_code': forms.NumberInput(attrs={"class": "form-control",
                                                                    "placeholder": "От 1 до 999"}),
            'message_text': forms.Textarea(attrs={"class": "form-control"}),
        }


class HomeView(View):

    def get(self, request):
        formset = MailingForm()
        return render(request, 'mailing.html', {"formset": formset})

    def post(self, request):
        formset = MailingForm(request.POST)
        if formset.is_valid():
            mailing = formset.save(commit=False)
            mailing.save()
            messages.success(request, 'Рассылка создана')
        else:
            formset = MailingForm()
        return render(request, 'mailing.html', {"formset": formset})
