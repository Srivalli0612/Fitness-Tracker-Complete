from django.db import models
from django.contrib.auth.models import User
from django.db import models

class DietEntry(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    calories = models.IntegerField()
    date = models.DateField(auto_now_add=True)  # IMPORTANT

class DietTemplate(models.Model):

    MEAL_TYPES = (
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
    )

    title = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)
    description = models.TextField(blank=True)
    calories = models.FloatField()
    protein = models.FloatField()
    carbs = models.FloatField()
    fats = models.FloatField()

    def __str__(self):
        return self.title


class UserDiet(models.Model):

    STATUS_CHOICES = (
        ('saved', 'Saved'),
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    diet = models.ForeignKey(DietTemplate, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='saved')

    def __str__(self):
        return f"{self.user.username} - {self.diet.title}"