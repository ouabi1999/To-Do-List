from django.shortcuts import render
from django.http import HttpResponse
from django.http.response import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user_model, login, logout, authenticate
from .validations import validate_email, validate_password
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import AllowAny

from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Users
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import logging
from rest_framework import viewsets, generics

from .serializers import UserSerializer, UserCreateSerializer, UserLoginSerializer, TaskSerializer
from .models import Users , Task

logger = logging.getLogger(__name__)


class UsersView(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = Users.objects.all()
    
class UsersList(APIView):
    def get(self, request, format=None):
        
        users_data = Users.objects.all()
        serializer = UserSerializer(users_data, many=True)
        return Response(serializer.data)
    
    def post(self, request, pk=None):
        data = request.data
        
        serializer = UserSerializer(data=data)
        try:
            user = Users.objects.get(email = data.get("email"))
            return JsonResponse("User already exist", safe=False, status=status.HTTP_400_BAD_REQUEST)

        except ObjectDoesNotExist:
            print("Either the blog or entry doesn't exist.")
            if serializer.is_valid():
                serializer.save()
                return JsonResponse("Student Created Successfully", safe=False) 
            else:
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
            
    
   
class UsersDetail(APIView):

    def get_student(self, pk):
        try:
            user = Users.objects.get(id=pk)
            return user
        except:
            return JsonResponse("Student Does Not Exist", safe=False)

    def get(self, request, pk=None):
        if pk:
            data = self.get_student(pk)
            serializer = UserSerializer(data)
        else:
            data = Users.objects.all()
            serializer = UserSerializer(data, many=True)
        return Response(serializer.data)

    

    def put(self, request, pk=None):
        data = request.data
        student_to_update = Users.objects.get(id=pk)
        serializer = UserSerializer(student_to_update, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse("Student Updated Successfully", safe=False)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        task_to_delete = Users.objects.get(id=pk) 
        task_to_delete.delete()
        return JsonResponse("Student Deleted Successfully", safe=False)
    
class UserTasksView(APIView):
      def get(self, request, pk):
           userTasks = Task.objects.filter(user=pk) 
           serializer = TaskSerializer(userTasks, many=True)
           return Response(serializer.data) 
          
class TaskView(APIView):
    def post(self, request):
        data = request.data
        serializer = TaskSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data , safe=False) 
        else:
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        
    def get(self, request) :
        users_data = Task.objects.all()
        serializer = TaskSerializer(users_data, many=True)
        return Response(serializer.data)
        
        
class TaskDetailView(APIView):
    def post(self, request, pk):
        data = request.data
        serializer = TaskSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse("Task added Successfully", safe=False) 
        else:
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, pk=None):
        data = request.data
        task_to_update = Task.objects.get(id=pk) 
        task_to_update.task = data.get("task")
        task_to_update.isChecked = data.get("isChecked")
        
        task_to_update.save() 
        
        task_data = Task.objects.all()
        serializer = TaskSerializer(task_to_update)
        return Response(serializer.data)
          
        
    def delete(self, request, pk=None):
        task_to_delete = Task.objects.get(id=pk)   
        task_to_delete.delete()
        userTasks = Task.objects.filter(user = task_to_delete.user)
        serializer = TaskSerializer(userTasks,  many=True)
        return Response(serializer.data)
    
    
class ProfileView(generics.RetrieveAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

    permission_classes = (IsAuthenticated,)
    
    def get_object(self):
        #tasks = self.request.user.task_set.all()
        return self.request.user 
    
class RegisterView(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserCreateSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        # If the registration is successful, generate JWT tokens and include them in the response
        if response.status_code == status.HTTP_201_CREATED:
            user = Users.objects.get(email=request.data['email'])
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response.data['access_token'] = access_token
            response.data['refresh_token'] = refresh_token

        return response

class LoginView(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data.get('user')

        if user:
            refresh = RefreshToken.for_user(user)
            
                
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            })
           
            

        # Handle the case where the user is not registered or password is incorrect
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        
        logout(request)
        return JsonResponse({'message': 'Logout successful'})
    
        """ refresh_token = request.data.get('refresh_token')
        print(refresh_token)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Successfully logged out.'})
        except Exception as e:
            return Response({'detail': 'Invalid refresh token.'}, status=400)
        """




class PasswordResetView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            return Response({'detail': 'User with this email does not exist.'}, status=400)

        uidb64 = urlsafe_base64_encode(force_bytes(user.id))
        token = default_token_generator.make_token(user)

        reset_link = f'{settings.FRONTEND_URL}/password-reset/{uidb64}/{token}/'

        send_mail(
            'Password Reset',
            f'Click the following link to reset your password: {reset_link}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return Response({'detail': 'Password reset link sent to your email.'})