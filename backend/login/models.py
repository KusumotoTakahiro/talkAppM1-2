from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils import timezone
from chatgptHandleAPI.models import *


class CustomUserManager(BaseUserManager):
  def _create_user(self, username, password, **extra_fields):
    if not username:
      raise ValueError('Users must have an name')
    user = self.model(
      username=username,
      **extra_fields
    )
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_user(self, username, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', False)
    extra_fields.setdefault('is_superuser', False)
    return self._create_user(username, password, **extra_fields)
  
  def create_superuser(self, username, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    if extra_fields.get('is_staff') is not True:
      raise ValueError('Superuser must have is_staff=True.')
    if extra_fields.get('is_superuser') is not True:
      raise ValueError('Superuser must have is_superuser=True.')
    return self._create_user(username, password, **extra_fields)



class CustomUser(AbstractBaseUser, PermissionsMixin):
  username_validator = UnicodeUsernameValidator()
  username = models.CharField(
        max_length=30,
        unique=True,
        help_text=(
          'Required. 30 characters or fewer. Letters, digits and @/./+/-/_ only.'
        ),
        validators=[username_validator],
        error_messages={
            'unique': ("A user with that username already exists."),
        },
    )
  is_active = models.BooleanField(default=True)
  is_staff = models.BooleanField(default=False)
  is_admin = models.BooleanField(default=False)
  date_joined = models.DateTimeField(auto_now=False, auto_now_add=True)
  objects = CustomUserManager()
  USERNAME_FIELD = "username"
  REQUIRED_FIELDS = []

  def __str__(self):
    return self.username
