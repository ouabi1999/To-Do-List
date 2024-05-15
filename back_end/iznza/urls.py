from django.conf import settings
from django.conf.urls.static import static

from django.urls import path, include

from .views import (UsersDetail,
                    UsersList, TaskView, index,
                    TaskDetailView,
                    RegisterView, LoginView,LogoutView, PasswordResetView, UserTasksView, ProfileView, )

urlpatterns = [
    
    path('users/', UsersList.as_view()),
    path('users-detail/<str:pk>/', UsersDetail.as_view()),
    path("task-view/", TaskView.as_view()),
    path('task-detail-view/<str:pk>/', TaskDetailView.as_view()),
    path('get-user-tasks/<str:pk>/', UserTasksView.as_view()),

    
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('', index, name='HomePageView')
    #path('register/', RegisterView.as_view()),
    #path('auth/', RetrieveUserView.as_view()),
    #path('login/', LoginView.as_view()),
]