from django.shortcuts import render
from django.views import View
from django.http import HttpResponse

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from RSO.models import WaterPumpingStation



