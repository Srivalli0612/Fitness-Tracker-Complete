from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Diet.models import UserDiet
from Workouts.models import UserWorkout
from datetime import date


# ================= REGISTER =================
from django.contrib.auth.models import User
from .models import UserProfile

class RegisterView(APIView):
    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        password = request.data.get("password")

        if User.objects.filter(username=email).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        user.first_name = name
        user.save()

        # ✅ CREATE PROFILE
        UserProfile.objects.create(
            user=user,
            age=request.data.get("age"),
            height=request.data.get("height"),
            weight=request.data.get("weight")
        )

        return Response({"message": "User registered successfully"})

# ================= LOGIN =================
from django.contrib.auth import authenticate

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=email, password=password)

        if user:
            return Response({
                "message": "Login successful",
                "user": {
                    "name": user.first_name,
                    "email": user.email
                }
            })
        else:
            return Response({"error": "Invalid credentials"}, status=400)


# ================= PROFILE =================
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response

from django.contrib.auth.models import User
from .models import UserProfile

class ProfileView(APIView):
    def get(self, request):
        email = request.GET.get("email")

        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"error": "User not found"}, status=404)

        profile, created = UserProfile.objects.get_or_create(user=user)

        return Response({
            "name": user.first_name,
            "email": user.email,
            "age": profile.age,
            "height": profile.height,
            "weight": profile.weight
        })

# ================= UPDATE PROFILE =================
class UpdateProfileView(APIView):
    def put(self, request):
        email = request.data.get("email")

        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"error": "User not found"}, status=404)

        profile, created = UserProfile.objects.get_or_create(user=user)

        user.first_name = request.data.get("name")
        user.save()

        profile.age = request.data.get("age")
        profile.height = request.data.get("height")
        profile.weight = request.data.get("weight")
        profile.save()

        return Response({"message": "Profile updated"})


# ================= PROGRESS =================
class ProgressView(APIView):
    def get(self, request):
        email = request.query_params.get("email")

        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"error": "User not found"}, status=404)

        today = date.today()

        diet_entries = UserDiet.objects.filter(
            user=user,
            date=today,
            status='completed'
        )

        calories_consumed = sum(
            [d.diet.calories for d in diet_entries if d.diet]
        )

        workouts = UserWorkout.objects.filter(
            user=user,
            date_assigned=today,
            status='completed'
        )

        calories_burned = sum(
            [w.actual_calories_burned or 0 for w in workouts]
        )

        return Response({
            "calories_consumed": calories_consumed,
            "calories_burned": calories_burned,
            "net_calories": calories_consumed - calories_burned
        })
    
class BMIRecommendationView(APIView):
    def post(self, request):
        height = float(request.data.get("height"))
        weight = float(request.data.get("weight"))

        bmi = weight / (height * height)

        if bmi < 18.5:
            category = "Underweight"
            workout = "Strength training, light cardio"
            diet = "High calorie, protein-rich meals"

        elif bmi < 25:
            category = "Normal"
            workout = "Balanced workouts (cardio + strength)"
            diet = "Balanced diet"

        elif bmi < 30:
            category = "Overweight"
            workout = "Cardio + fat-burning workouts"
            diet = "Low calorie, low fat diet"

        else:
            category = "Obese"
            workout = "Daily cardio + light strength training"
            diet = "Strict calorie deficit diet"

        return Response({
            "bmi": round(bmi, 2),
            "category": category,
            "workout_recommendation": workout,
            "diet_recommendation": diet
        })