import json
import os
import numpy as np
from PIL import Image
import io
import base64
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import tensorflow as tf
from .services.weather_service import get_weather_data, calculate_risk_score
from .services.groq_service import get_chatbot_response
from .services.alert_service import AlertService

# Load ML Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ml_model', 'best_plant_disease_model.h5')
CLASSES_PATH = os.path.join(os.path.dirname(__file__), 'ml_model', 'class_names.json')

model = tf.keras.models.load_model(MODEL_PATH)
with open(CLASSES_PATH, 'r') as f:
    class_names = json.load(f)

# In-memory storage (since no database)
users = {}
sessions = {}
infection_reports = []
active_locations = {}

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    return JsonResponse({"status": "healthy", "model_loaded": True})

@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    
    # Default admin
    if email == "admin@cropdisease.com" and password == "Admin@123":
        return JsonResponse({
            "success": True, 
            "user": {"email": email, "name": "Admin", "role": "admin"},
            "token": "admin-token-123"
        })
    
    # Check registered users
    if email in users and users[email]['password'] == password:
        return JsonResponse({
            "success": True,
            "user": {"email": email, "name": users[email]['name'], "role": "farmer"},
            "token": f"token-{email}"
        })
    
    return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)

@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    data = json.loads(request.body)
    email = data.get('email')
    
    if email in users:
        return JsonResponse({"success": False, "error": "User already exists"}, status=400)
    
    users[email] = {
        'name': data.get('name'),
        'password': data.get('password'),
        'phone': data.get('phone'),
        'location': None
    }
    
    return JsonResponse({"success": True, "message": "Registration successful"})

@csrf_exempt
@require_http_methods(["POST"])
def predict_disease(request):
    try:
        data = json.loads(request.body)
        image_data = data.get('image')  # base64 image
        lat = data.get('latitude')
        lon = data.get('longitude')
        
        # Decode image
        image = base64.b64decode(image_data.split(',')[1])
        img = Image.open(io.BytesIO(image))
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Predict
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        
        disease_name = class_names[predicted_class] if isinstance(class_names, list) else class_names[str(predicted_class)]
        
        # Get weather data
        weather = get_weather_data(lat, lon) if lat and lon else None
        
        # Calculate risk
        risk_score = calculate_risk_score(confidence, weather)
        
        # Determine recommendation
        if risk_score > 0.7:
            recommendation = "TREAT IMMEDIATELY"
            severity = "High Risk"
        elif risk_score > 0.4:
            recommendation = "MONITOR CLOSELY"
            severity = "Medium Risk"
        else:
            recommendation = "IGNORE - LOW RISK"
            severity = "Low Risk"
        
        # Get treatment info
        treatment = get_treatment_info(disease_name)
        
        # If high risk, trigger alert
        if risk_score > 0.7 and lat and lon:
            infection_reports.append({
                'disease': disease_name,
                'latitude': lat,
                'longitude': lon,
                'timestamp': str(datetime.now()),
                'reported_by': data.get('email', 'anonymous')
            })
            AlertService.trigger_alert(disease_name, lat, lon)
        
        return JsonResponse({
            "success": True,
            "disease": disease_name,
            "confidence": confidence,
            "risk_score": risk_score,
            "severity": severity,
            "recommendation": recommendation,
            "treatment": treatment,
            "weather": weather,
            "prevention": get_prevention_tips(disease_name)
        })
        
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def get_weather(request):
    data = json.loads(request.body)
    lat = data.get('latitude')
    lon = data.get('longitude')
    
    weather = get_weather_data(lat, lon)
    return JsonResponse({"success": True, "weather": weather})

@csrf_exempt
@require_http_methods(["POST"])
def chatbot_query(request):
    data = json.loads(request.body)
    query = data.get('query')
    language = data.get('language', 'english')
    
    response = get_chatbot_response(query, language)
    return JsonResponse({"success": True, "response": response})

@csrf_exempt
@require_http_methods(["POST"])
def report_infection(request):
    data = json.loads(request.body)
    
    infection_reports.append({
        'disease': data.get('disease'),
        'latitude': data.get('latitude'),
        'longitude': data.get('longitude'),
        'timestamp': str(datetime.now()),
        'reported_by': data.get('email')
    })
    
    AlertService.trigger_alert(data.get('disease'), data.get('latitude'), data.get('longitude'))
    
    return JsonResponse({"success": True})

@csrf_exempt
@require_http_methods(["POST"])
def get_nearby_alerts(request):
    data = json.loads(request.body)
    lat = data.get('latitude')
    lon = data.get('longitude')
    
    nearby = AlertService.get_nearby_alerts(lat, lon)
    return JsonResponse({"success": True, "alerts": nearby})

def get_treatment_info(disease):
    treatments = {
        "default": {
            "medicine": "Consult local agricultural officer",
            "organic": "Neem oil spray",
            "chemical": "Copper-based fungicide"
        }
    }
    return treatments.get(disease, treatments["default"])

def get_prevention_tips(disease):
    return "Maintain proper spacing, avoid overhead irrigation, use disease-resistant varieties"

from datetime import datetime