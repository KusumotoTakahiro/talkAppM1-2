from django.contrib import admin
from django.contrib.auth import get_user_model
from chatgptHandleAPI.models import *

CustomUser = get_user_model()

admin.site.register(CustomUser)
admin.site.register(Thread)
admin.site.register(Utterance)
admin.site.register(UserPersona)
admin.site.register(SystemPersona)
