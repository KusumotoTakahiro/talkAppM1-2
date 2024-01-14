from rest_framework import serializers
from .models import *


class ThreadSerializer(serializers.ModelSerializer):
  class Meta:
    model = Thread
    fields = '__all__'


class UttranceSerializer(serializers.ModelSerializer):
  class Meta:
    model = Utterance
    fields = '__all__'


class SystemPersonSerializer(serializers.ModelSerializer):
  class Meta:
    model = SystemPersona
    fields = '__all__'


class UserPersonaSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserPersona
    fields = '__all__'



