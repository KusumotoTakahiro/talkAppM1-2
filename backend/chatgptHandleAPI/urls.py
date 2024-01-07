from django.urls import path, include
from .views import *

urlpatterns = [
  path('thread', ThreadListView.as_view()),
  path('thread/<str:pk>/', ThreadDetailView.as_view()),
  path('Uttrance', UttranceListView.as_view()),
  path('Uttrance/<str:pk>/', UttranceDetailView.as_view()),
  path('SystemPersona', SystemPersonaListView.as_view()),
  path('SystemPersona/<str:pk>/', SystemPersonaDetailView.as_view()),
  path('UserPersona', UserPersonaListView.as_view()),
  path('UserPersona/<str:pk>/', UserPersonaDetailView.as_view())
]