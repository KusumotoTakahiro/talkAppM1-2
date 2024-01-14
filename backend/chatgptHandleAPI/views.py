from django.shortcuts import render
from .models import *
from .serializers import (
  ThreadSerializer,
  UttranceSerializer,
  SystemPersonSerializer,
  UserPersonaSerializer,
)
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from functions.response_generator import create_response
from functions.persona import sprit_sentences


class ThreadListView(generics.ListCreateAPIView):
  queryset = Thread.objects.all()
  serializer_class = ThreadSerializer

  def create(self, request):
    data = request.data
    user_serializer =  self.get_serializer(data=data)
    user_serializer.is_valid(raise_exception=True)
    user_serializer.save()
    headers = self.get_success_headers(user_serializer.data)
    return Response(
      user_serializer.data, 
      status=status.HTTP_201_CREATED, 
      headers=headers
    )



class ThreadDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Thread.objects.all()
  serializer_class = ThreadSerializer



class UttranceListView(generics.ListCreateAPIView):
  queryset = Utterance.objects.all()
  serializer_class = UttranceSerializer

  def create(self, request):
    data = request.data
    user_serializer =  self.get_serializer(data=data)
    user_serializer.is_valid(raise_exception=True)
    user_serializer.save()

    # ここにPOSTデータを加工する処理を追加(ChatGPTを通すなど)
    processed_data = create_response(data)

    # シリアライザを使って加工後のデータを保存
    system_serializer = self.get_serializer(data=processed_data)
    system_serializer.is_valid(raise_exception=True)
    system_serializer.save()

    headers = self.get_success_headers(user_serializer.data)
    return Response(
      {
        'system': system_serializer.data,
        'user': user_serializer.data
      },
      status=status.HTTP_201_CREATED, 
      headers=headers
    )



class UttranceDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Utterance.objects.all()
  serializer_class = UttranceSerializer



class SystemPersonaListView(generics.ListCreateAPIView):
  queryset = SystemPersona.objects.all()
  serializer_class = SystemPersonSerializer

  def create(self, request):
    data = request.data 
    user_serializer =  self.get_serializer(data=data)
    user_serializer.is_valid(raise_exception=True)
    user_serializer.save()



class SystemPersonaDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = SystemPersona.objects.all()
  serializer_class = SystemPersonSerializer



class UserPersonaListView(generics.ListCreateAPIView):
  queryset = UserPersona.objects.all()
  serializer_class = UserPersonaSerializer

  def create(self, request):
    data = request.data
    sentences = sprit_sentences(data)
    headers = None
    for sentence in sentences:
      print(sentence)
      if (sentence['is_persona']):
        processed_data = {
          'thread': data['thread'],
          'utterance': data['utterance'],
          'persona': sentence['sentence'],
        }
        user_serializer =  self.get_serializer(data=processed_data)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()
        headers = self.get_success_headers(user_serializer.data)
    return Response(
      {},
      status=status.HTTP_201_CREATED, 
      headers=headers
    )



class UserPersonaDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = UserPersona.objects.all()
  serializer_class = UserPersonaSerializer

