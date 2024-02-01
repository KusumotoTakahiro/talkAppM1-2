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
  
  def list(self, request):
    queryset = self.filter_queryset(self.get_queryset())
    userid = request.query_params.get('user')
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      redata = filter_by_userid(serializer.data, userid)
      sorted_deta = sorted_by_created(redata)
      return self.get_paginated_response(sorted_deta)

    serializer = self.get_serializer(queryset, many=True)
    redata = filter_by_userid(serializer.data, userid)
    sorted_deta = sorted_by_created(redata)
    return Response(sorted_deta)



class ThreadDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Thread.objects.all()
  serializer_class = ThreadSerializer



class UttranceListView(generics.ListCreateAPIView):
  queryset = Utterance.objects.all()
  serializer_class = UttranceSerializer

  def create(self, request):
    data = request.data
    # user側のutteranceを保存
    user_serializer =  self.get_serializer(data=data)
    user_serializer.is_valid(raise_exception=True)
    user_serializer.save()
    # system側のutteranceを保存
    processed_data = create_response(data, UserPersona, SystemPersona)
    system_serializer = self.get_serializer(data=processed_data)
    system_serializer.is_valid(raise_exception=True)
    system_serializer.save()
    # responseの設定
    headers = self.get_success_headers(user_serializer.data)
    return Response(
      {
        'system': system_serializer.data,
        'user': user_serializer.data
      },
      status=status.HTTP_201_CREATED, 
      headers=headers
    )
  
  def list(self, request):
    queryset = self.filter_queryset(self.get_queryset())
    thread = request.query_params.get('thread')
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      redata = filter_by_thread(serializer.data, thread)
      sorted_deta = sorted_by_created(redata)
      return self.get_paginated_response(sorted_deta)

    serializer = self.get_serializer(queryset, many=True)
    redata = filter_by_thread(serializer.data, thread)
    sorted_deta = sorted_by_created(redata)
    return Response(sorted_deta)



class UttranceDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Utterance.objects.all()
  serializer_class = UttranceSerializer



class SystemPersonaListView(generics.ListCreateAPIView):
  queryset = SystemPersona.objects.all()
  serializer_class = SystemPersonSerializer

  def create(self, request):
    data = request.data
    sentences = sprit_sentences(data)
    headers = None
    for sentence in sentences:
      if (sentence['is_persona']):
        processed_data = {
          'thread': data['thread'],
          'utterance': data['utterance'],
          'persona': sentence['sentence'],
          'similarity': 0 #本来はここを計算する．もしくは固定値にする．
        }
        system_serializer =  self.get_serializer(data=processed_data)
        system_serializer.is_valid(raise_exception=True)
        system_serializer.save()
        headers = self.get_success_headers(system_serializer.data)
    return Response(
      {},
      status=status.HTTP_201_CREATED, 
      headers=headers
    )
  
  def list(self, request):
    queryset = self.filter_queryset(self.get_queryset())
    thread = request.query_params.get('thread')
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      redata = filter_by_thread(serializer.data, thread)
      return self.get_paginated_response(redata)

    serializer = self.get_serializer(queryset, many=True)
    redata = filter_by_thread(serializer.data, thread)
    return Response(redata)



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

  def list(self, request):
    queryset = self.filter_queryset(self.get_queryset())
    thread = request.query_params.get('thread')
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      redata = filter_by_thread(serializer.data, thread)
      return self.get_paginated_response(redata)

    serializer = self.get_serializer(queryset, many=True)
    redata = filter_by_thread(serializer.data, thread)
    return Response(redata)



class UserPersonaDetailView(generics.RetrieveUpdateDestroyAPIView):
  queryset = UserPersona.objects.all()
  serializer_class = UserPersonaSerializer


def filter_by_thread(serializer_data, thread):
  redata = []
  for data in serializer_data:
    if (str(data['thread']) == thread):
      redata.append(data)
  return redata

def filter_by_userid(serializer_data, userid):
  redata = []
  for data in serializer_data:
    if (str(data['user']) == userid):
      redata.append(data)
  return redata

def sorted_by_created(redata):
  sorted_data = sorted(redata, key=lambda s: s['created_at'])
  return sorted_data
