from rest_framework import serializers
from .models import WorkoutTemplate, UserWorkout


class WorkoutTemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkoutTemplate
        fields = [
            'id',
            'title',
            'workout_type',
            'description',
            'instructions',
            'average_duration_minutes',
            'average_calories_burned',
        ]

class UserWorkoutSerializer(serializers.ModelSerializer):

    workout_details = WorkoutTemplateSerializer(source='workout', read_only=True)

    class Meta:
        model = UserWorkout
        fields = [
            'id',
            'workout',                 # template id (for assigning)
            'workout_details',         # full template details
            'date_assigned',
            'status',
            'actual_duration',
            'actual_calories_burned',
            'completed_at',
        ]

        read_only_fields = [
            'date_assigned',
            'status',
            'completed_at',
            'actual_calories_burned',
        ]