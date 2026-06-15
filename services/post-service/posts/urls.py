from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_posts, name='get_posts'),
    path('create/', views.create_post, name='create_post'),
    path('notifications/', views.notifications, name='notifications'),
    path('<int:pk>/', views.post_detail, name='post_detail'),
    path('<int:pk>/like/', views.toggle_like, name='toggle_like'),
]
