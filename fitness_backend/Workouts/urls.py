from django.urls import path
from .views import *

urlpatterns = [
    path('templates/', WorkoutTemplateListView.as_view()),
    path('assign/', AssignWorkoutView.as_view()),
    path('my-workouts/', UserWorkoutListView.as_view()),
    path('today/', TodayWorkoutView.as_view()),
    path('complete/<int:pk>/', CompleteWorkoutView.as_view()),
    path('add-to-today/', AddToTodayView.as_view()),
    path('delete/<int:pk>/', DeleteWorkoutView.as_view()),
]