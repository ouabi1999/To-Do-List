from django.contrib import admin

# Register your models here.
from .models import Users

class UsersAdmin(admin.ModelAdmin):
    list_display = ['fullName', 'email','password']

# Register your models here.

admin.site.register(Users, UsersAdmin)