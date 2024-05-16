from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from uuid import uuid4

def get_uuid():
    return uuid4().hex

# Create your models here.
class UserAccountManager(BaseUserManager):
    def create_user(self, fullName, email, password= None):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        email = email.lower()
        
        user = self.model(
            fullName = fullName,
            email = email,
            password = password
            )
        user.set_password(password)
        user.save(using = self._db)
        return user
        
    def create_superuser(self, fullName, email, password= None):
        user = self.create_user(
            fullName = fullName,
            email = email,
            password = password
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using = self._db)
        return user
    
class Users(AbstractBaseUser, PermissionsMixin):
    id = models.CharField(unique=True, primary_key=True, max_length=250, default=get_uuid )
    fullName = models.CharField(max_length=120)
    email = models.EmailField(unique = True, max_length=240)
    password = models.CharField(max_length=240)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserAccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullName' ,'password']
    def __str__(self):
        return  f"{self.fullName}  {self.is_staff} {self.email} "
    
    
class Task(models.Model):
    id = models.CharField(unique=True, primary_key=True, default=get_uuid)
    task = models.CharField(max_length=200)
    isChecked = models.BooleanField(default=False)
    user = models.ForeignKey(Users, on_delete=models.PROTECT, blank=False)
    def __str__(self):
        return f"{self.id} {self.user} {self.task} {self.isChecked}"