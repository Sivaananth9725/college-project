import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')

def get_weather_data(lat, lon):
    if not lat or not lon:
        return None
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=10)
        data = response.json()
        
        return {
            "temperature": data['main']['temp'],
            "humidity": data['main']['humidity'],
            "rainfall": data.get('rain', {}).get('1h', 0),
            "description": data['weather'][0]['description'],
            "ph": 6.5  # Default pH value
        }
    except:
        return {"temperature": 25, "humidity": 60, "rainfall": 0, "ph": 6.5}

def calculate_risk_score(confidence, weather):
    if not weather:
        return confidence * 0.7
    
    # Environmental risk factors
    temp = weather.get('temperature', 25)
    humidity = weather.get('humidity', 60)
    
    env_risk = 0
    if 20 <= temp <= 30:  # Optimal for fungal growth
        env_risk += 0.3
    if humidity > 80:
        env_risk += 0.4
    elif humidity > 60:
        env_risk += 0.2
    
    # Combine with confidence
    risk = (confidence * 0.6) + (env_risk * 0.4)
    return min(risk, 1.0)