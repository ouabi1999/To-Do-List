from rest_framework import serializers
from .models import Users, Task
from django.contrib.auth import get_user_model,  authenticate
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django import forms




User = get_user_model()
class  UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('fullName', 'email','password')
        
    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email address is already registered.")
        return email
        
    
    
    def create(self, validated_data):
        user = User.objects.create_user(
            fullName = validated_data['fullName'],
            email = validated_data['email'],
            password = validated_data['password'],

        )
        
        return user

    

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not  email:
            raise serializers.ValidationError("Username or email is required.")

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid login credentials. Please try again.")

        data['user'] = user
        return data   
    
class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ("id", "fullName", 'email', 'password')
    extra_kwargs = {'password': {'write_only': True}, }


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"