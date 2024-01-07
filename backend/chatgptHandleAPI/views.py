from django.shortcuts import render
from .models import *
from .serializers import (
  ThreadSerializer,
  UttranceSerializer,
  SystemPersonSerializer,
  UserPersonaSerializer,
)
from rest_framework import generics


class ThreadListView(generics.ListCreateAPIView):
  queryset = Thread.objects.all()
  serializers_class = ThreadSerializer

class ThreadDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Thread.objects.all()
  serializers_class = ThreadSerializer


class UttranceListView(generics.ListCreateAPIView):
  queryset = Utterance.objects.all()
  serialziers_class = UttranceSerializer


class UttranceDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Utterance.objects.all()
  serialziers_class = UttranceSerializer


class SystemPersonaListView(generics.ListCreateAPIView):
  queryset = SystemPersona.objects.all()
  serializers_class = SystemPersonSerializer


class SystemPersonaDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = SystemPersona.objects.all()
  serializers_class = SystemPersonSerializer


class UserPersonaListView(generics.ListCreateAPIView):
  queryset = UserPersona.objects.all()
  serializers_class = UserPersonaSerializer


class UserPersonaDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = UserPersona.objects.all()
  serializers_class = UserPersonaSerializer

