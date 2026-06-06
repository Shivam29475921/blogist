from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.generate_blog, name='generate'),
    path('generate-blog/', views.generate_blog, name='generate_blog'),
]
