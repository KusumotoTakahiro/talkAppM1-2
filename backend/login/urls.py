from .views import *
from django.urls import path, include
from rest_framework.authtoken import views
from .auth import CustomAuthToken

app_name = 'login'
urlpatterns = [
  path('accounts/', RegisterView.as_view(), name="accounts"),
  path('api-token-auth/', CustomAuthToken.as_view()),
]