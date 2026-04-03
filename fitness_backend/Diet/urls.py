from django.urls import path
from .views import *

urlpatterns = [
    path('templates/', DietTemplateListView.as_view()),
    path('assign/', AssignDietView.as_view()),
    path('my-diet/', UserDietListView.as_view()),
    path('add-to-today/', AddDietToTodayView.as_view()),
    path('today/', TodayDietView.as_view()),
    path('complete/<int:pk>/', CompleteDietView.as_view()),
    path('delete/<int:pk>/', DeleteDietView.as_view()),
    path('calories-today/', TodayCaloriesView.as_view()),
]