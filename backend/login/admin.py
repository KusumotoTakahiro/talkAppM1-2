from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from chatgptHandleAPI.models import *

CustomUser = get_user_model()

class CustomUserAdmin(UserAdmin):
  list_display = (
    "username",
    "is_staff",
    "is_active",
    "is_admin",
    "date_joined",
  )
  list_filter = (
    "username",
    "is_staff",
    "is_active",
    "is_admin"
  )
  basic = ("username", "password")
  auth = ("is_staff", "is_active", "is_admin")
  fieldsets = (
    ("BasicInfo", {"fields": basic}),
    ("Auth", {"fields": auth}),
  )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Thread)
admin.site.register(Utterance)
admin.site.register(UserPersona)
admin.site.register(SystemPersona)
