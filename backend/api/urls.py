from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health'),
    path('login/', views.login_user, name='login'),
    path('register/', views.register_user, name='register'),
    path('predict/', views.predict_disease, name='predict'),
    path('weather/', views.get_weather, name='weather'),
    path('chatbot/', views.chatbot_query, name='chatbot'),
    path('report-infection/', views.report_infection, name='report-infection'),
    path('nearby-alerts/', views.get_nearby_alerts, name='nearby-alerts'),
]