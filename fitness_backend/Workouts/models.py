from django.db import models
from django.contrib.auth.models import User


class WorkoutTemplate(models.Model):

    WORKOUT_TYPES = (
        ('arms', 'Arms'),
        ('legs', 'Legs'),
        ('chest', 'Chest'),
        ('back', 'Back'),
        ('full', 'Full Body'),
        ('cardio', 'Cardio'),
    )

    title = models.CharField(max_length=100)
    workout_type = models.CharField(max_length=20, choices=WORKOUT_TYPES)
    description = models.TextField(blank=True)
    instructions = models.TextField()
    average_duration_minutes = models.IntegerField()
    average_calories_burned = models.FloatField()

    def __str__(self):
        return self.title


class UserWorkout(models.Model):

    STATUS_CHOICES = (
    ('saved', 'Saved'),
    ('pending', 'Pending'),
    ('completed', 'Completed'),
)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_workouts')
    workout = models.ForeignKey(WorkoutTemplate, on_delete=models.CASCADE)
    date_assigned = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    actual_duration = models.IntegerField(null=True, blank=True)
    actual_calories_burned = models.FloatField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Set default actual_duration from workout template
        if self.actual_duration is None and self.workout:
            self.actual_duration = self.workout.average_duration_minutes
            self.actual_calories_burned = self.workout.average_calories_burned
        else:
            self.actual_calories_burned = (self.actual_duration / self.workout.average_duration_minutes) * self.workout.average_calories_burned
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.workout.title}"