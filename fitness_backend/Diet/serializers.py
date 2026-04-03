from rest_framework import serializers
from .models import DietTemplate, UserDiet


class DietTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietTemplate
        fields = '__all__'


class UserDietSerializer(serializers.ModelSerializer):
    diet_details = DietTemplateSerializer(source='diet', read_only=True)

    class Meta:
        model = UserDiet
        fields = '__all__'