from .models import CustomUser
from .serializers import RegisterSerializer
from rest_framework import generics


class RegisterView(generics.ListCreateAPIView):
  queryset = CustomUser.objects.all()
  serializer_class = RegisterSerializer

