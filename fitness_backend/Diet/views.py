from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from datetime import date

from .models import DietTemplate, UserDiet
from .serializers import DietTemplateSerializer, UserDietSerializer

from datetime import date
from .models import DietEntry
from django.http import JsonResponse

def today_calories(request):
    today = date.today()

    total = DietEntry.objects.filter(date=today).aggregate(
        total=models.Sum('calories')
    )['total'] or 0

    return JsonResponse({"today_calories": total})

class DietTemplateListView(generics.ListAPIView):
    queryset = DietTemplate.objects.all()
    serializer_class = DietTemplateSerializer
    permission_classes = [AllowAny]

class AssignDietView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        diet_id = request.data.get("diet")

        user = User.objects.get(email=email)

        if UserDiet.objects.filter(user=user, diet_id=diet_id, status='saved').exists():
            return Response({"error": "Diet already saved"}, status=400)

        UserDiet.objects.create(user=user, diet_id=diet_id, status='saved')

        return Response({"message": "Saved"})

class UserDietListView(generics.ListAPIView):
    serializer_class = UserDietSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        email = self.request.query_params.get("email")
        user = User.objects.get(email=email)

        return UserDiet.objects.filter(user=user, status='saved')
    
class AddDietToTodayView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        diet_id = request.data.get("diet")

        user = User.objects.get(email=email)

        if UserDiet.objects.filter(user=user, diet_id=diet_id, status='pending').exists():
            return Response({"error": "Already added"}, status=400)

        UserDiet.objects.create(user=user, diet_id=diet_id, status='pending')

        return Response({"message": "Added"})
    
class TodayDietView(generics.ListAPIView):
    serializer_class = UserDietSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        email = self.request.query_params.get("email")
        user = User.objects.get(email=email)

        return UserDiet.objects.filter(user=user, status='pending')

class CompleteDietView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, pk):
        diet = UserDiet.objects.get(id=pk)

        diet.status = 'completed'
        diet.save()

        return Response({"message": "Completed"})
    
class DeleteDietView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        email = request.data.get("email")
        user = User.objects.get(email=email)

        diet = UserDiet.objects.get(id=pk, user=user, status='saved')
        diet.delete()

        return Response({"message": "Deleted"})
    

class TodayCaloriesView(APIView):
    def get(self, request):
        email = request.query_params.get("email")

        if not email:
            return Response({"error": "Email required"}, status=400)

        user = User.objects.get(email=email)

        today_meals = UserDiet.objects.filter(
            user=user,
            status='completed'
        )

        total_calories = sum(d.diet.calories for d in today_meals)

        return Response({
            "total_calories": total_calories
        })