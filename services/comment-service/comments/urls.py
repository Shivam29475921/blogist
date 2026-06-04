from django.urls import path
from . import views

urlpatterns = [
    path('', views.add_comment, name= 'add_comment'),
    path('<int:post_id>/', views.get_comments, name='get_comments'),
]