from django.urls import path
from . import views

urlpatterns = [
    path('send-otp/', views.send_otp, name='send_otp'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('users/<str:username>/', views.public_profile, name='public_profile'),
    path('users/<str:username>/follow/', views.toggle_follow, name='toggle_follow'),
    path('users/<str:username>/follow-status/', views.follow_status, name='follow_status'),
    path('notifications/', views.notifications, name='notifications'),
    path('notifications/read/', views.mark_notifications_read, name='mark_notifications_read'),
]
