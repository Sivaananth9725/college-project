import math
from datetime import datetime, timedelta

# In-memory alerts
alerts = []
active_users = {}

class AlertService:
    @staticmethod
    def trigger_alert(disease, lat, lon):
        alert = {
            'id': len(alerts) + 1,
            'disease': disease,
            'latitude': lat,
            'longitude': lon,
            'timestamp': datetime.now().isoformat(),
            'radius_km': 5
        }
        alerts.append(alert)
        
        # Keep only last 100 alerts
        if len(alerts) > 100:
            alerts.pop(0)
        
        return alert
    
    @staticmethod
    def get_nearby_alerts(user_lat, user_lon):
        nearby = []
        
        for alert in alerts:
            # Check if alert is within 24 hours
            alert_time = datetime.fromisoformat(alert['timestamp'])
            if datetime.now() - alert_time > timedelta(hours=24):
                continue
            
            # Calculate distance
            distance = AlertService.haversine(
                user_lat, user_lon,
                alert['latitude'], alert['longitude']
            )
            
            if distance <= alert['radius_km']:
                nearby.append({
                    **alert,
                    'distance_km': round(distance, 2)
                })
        
        return nearby
    
    @staticmethod
    def haversine(lat1, lon1, lat2, lon2):
        R = 6371  # Earth's radius in km
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        return R * c