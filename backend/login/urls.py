from .views import *
from django.urls import path, include

app_name = 'login'
urlpatterns = [
  path('accounts', RegisterView.as_view(), name="accounts"),
]