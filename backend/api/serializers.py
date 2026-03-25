from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField()
    password = serializers.CharField()
    phone = serializers.CharField(required=False)

class PredictionSerializer(serializers.Serializer):
    image = serializers.CharField()
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)
    email = serializers.EmailField(required=False)

class WeatherSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()

class ChatbotSerializer(serializers.Serializer):
    query = serializers.CharField()
    language = serializers.CharField(default='english')

class InfectionReportSerializer(serializers.Serializer):
    disease = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    email = serializers.EmailField()

class NearbyAlertsSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()