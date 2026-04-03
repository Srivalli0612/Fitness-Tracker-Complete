from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from datetime import date
from rest_framework.exceptions import ValidationError

from .models import WorkoutTemplate, UserWorkout
from .serializers import WorkoutTemplateSerializer, UserWorkoutSerializer
from django.contrib.auth.models import User


# ================= WORKOUT TEMPLATES =================
class WorkoutTemplateListView(generics.ListAPIView):
    queryset = WorkoutTemplate.objects.all()
    serializer_class = WorkoutTemplateSerializer
    permission_classes = [AllowAny]


# ================= ASSIGN WORKOUT =================
from rest_framework.exceptions import ValidationError

class AssignWorkoutView(generics.CreateAPIView):
    serializer_class = UserWorkoutSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        email = self.request.data.get("email")
        workout_id = self.request.data.get("workout")

        user = User.objects.get(email=email)

        # Prevent duplicate saved workouts
        if UserWorkout.objects.filter(user=user, workout_id=workout_id, status='saved').exists():
            raise ValidationError({"error": "Workout already saved"})

        serializer.save(user=user, status='saved')
# ================= USER WORKOUT LIST =================
class UserWorkoutListView(generics.ListAPIView):
    serializer_class = UserWorkoutSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        email = self.request.query_params.get("email")
        user = User.objects.get(email=email)

        return UserWorkout.objects.filter(
            user=user,
            status='saved'
        )
    
from rest_framework.views import APIView

class AddToTodayView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        workout_id = request.data.get("workout")

        user = User.objects.get(email=email)
        workout = WorkoutTemplate.objects.get(id=workout_id)

        # Prevent duplicate for today
        if UserWorkout.objects.filter(user=user, workout=workout, status='pending').exists():
            return Response({"error": "Already added for today"}, status=400)

        UserWorkout.objects.create(
            user=user,
            workout=workout,
            status='pending'
        )

        return Response({"message": "Added to today"})

class DeleteWorkoutView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        email = request.data.get("email")
        user = User.objects.get(email=email)

        workout = UserWorkout.objects.get(id=pk, user=user, status='saved')
        workout.delete()

        return Response({"message": "Deleted successfully"})

# ================= TODAY WORKOUT =================
class TodayWorkoutView(generics.ListAPIView):
    serializer_class = UserWorkoutSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        email = self.request.query_params.get("email")
        user = User.objects.get(email=email)

        return UserWorkout.objects.filter(
            user=user,
            status='pending'
        )


# ================= COMPLETE WORKOUT =================
class CompleteWorkoutView(generics.UpdateAPIView):
    serializer_class = UserWorkoutSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        email = self.request.data.get("email")
        user = User.objects.get(email=email)

        return UserWorkout.objects.filter(user=user)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.status = 'completed'
        instance.completed_at = timezone.now()
        instance.save()

        return Response({"message": "Workout completed"})