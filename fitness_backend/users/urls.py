from django.urls import path
from .views import RegisterView, LoginView, ProfileView, ProgressView, UpdateProfileView, BMIRecommendationView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('update-profile/', UpdateProfileView.as_view()),
    path('progress/', ProgressView.as_view()),
    path('bmi-recommendation/', BMIRecommendationView.as_view())
]