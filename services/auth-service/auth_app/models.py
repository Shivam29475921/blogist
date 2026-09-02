from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Email is required')
        if not username:
            raise ValueError('Username is required')
        email =self.normalize_email(email)
        user= self.model(email=email, username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user= self.create_user(email,username, password)
        user.is_staff =True
        user.is_superuser =True
        user.save(using=self.db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=80, blank=True)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects =UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELD = ['username']
    def __str__(self):
        return self.email
    

class Follow(models.Model):
    follower_id = models.IntegerField()
    follower_username = models.CharField(max_length=50)
    following_id = models.IntegerField()
    following_username = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['follower_id', 'following_id']

    def __str__(self):
        return f'{self.follower_username} follows {self.following_username}'


class Notification(models.Model):
    recipient_id = models.IntegerField()
    actor_id = models.IntegerField()
    actor_username = models.CharField(max_length=50)
    notification_type = models.CharField(max_length=20)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.message


class EmailOTP(models.Model):
    email = models.EmailField(db_index=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Email OTP'
        verbose_name_plural = 'Email OTPs'
        ordering = ['-created_at']

    def is_valid(self):
        from django.utils import timezone
        # Valid for 10 minutes (600 seconds)
        return (timezone.now() - self.created_at).total_seconds() < 600

    def __str__(self):
        return f'{self.email} - {self.otp}'
