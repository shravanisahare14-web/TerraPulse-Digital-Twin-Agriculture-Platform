import json
import csv
import random
import time
from datetime import datetime
from pathlib import Path

# ==========================================
# FILE PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "dashboard" / "data"

JSON_FILE = DATA_DIR / "sensor_data.json"
CSV_FILE = DATA_DIR / "sensor_data.csv"

DATA_DIR.mkdir(parents=True, exist_ok=True)

# ==========================================
# SENSOR SIMULATION
# ==========================================

temperature = random.randint(24, 35)
humidity = random.randint(50, 75)
soil_moisture = random.randint(40, 80)
light_intensity = random.randint(300, 900)
water_level = random.randint(50, 100)

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def clamp(value, minimum, maximum):
    return max(minimum, min(value, maximum))


def update_environment():
    global temperature
    global humidity
    global soil_moisture
    global light_intensity
    global water_level

    temperature += random.randint(-2, 2)
    humidity += random.randint(-3, 3)
    soil_moisture += random.randint(-5, 2)
    light_intensity += random.randint(-50, 50)
    water_level += random.randint(-2, 1)

    temperature = clamp(temperature, 20, 45)
    humidity = clamp(humidity, 20, 95)
    soil_moisture = clamp(soil_moisture, 0, 100)
    light_intensity = clamp(light_intensity, 100, 1000)
    water_level = clamp(water_level, 0, 100)


# ==========================================
# KPI CALCULATIONS
# ==========================================

def temperature_score(temp):
    if 22 <= temp <= 35:
        return 100

    if temp < 22:
        return max(0, 100 - ((22 - temp) * 8))

    return max(0, 100 - ((temp - 35) * 8))


def calculate_crop_health():

    temp_score = temperature_score(temperature)

    health = (
        soil_moisture * 0.40 +
        humidity * 0.25 +
        temp_score * 0.20 +
        water_level * 0.15
    )

    return round(health, 1)


def calculate_risk_score():

    risk = 0

    if soil_moisture < 30:
        risk += 40

    if temperature > 40:
        risk += 30

    if water_level < 20:
        risk += 20

    if humidity < 35:
        risk += 10

    return min(risk, 100)


def calculate_water_efficiency(risk_score):
    return max(0, 100 - risk_score)


def get_pump_status():

    if soil_moisture < 30:
        return "ACTIVE"

    return "STANDBY"


# ==========================================
# ALERT ENGINE
# ==========================================

def generate_alerts():

    alerts = []

    if soil_moisture < 30:
        alerts.append("Water Stress Detected")

    if temperature > 40:
        alerts.append("Heat Risk Detected")

    if water_level < 20:
        alerts.append("Low Reservoir Level")

    if humidity < 35:
        alerts.append("Low Humidity Warning")

    return alerts


# ==========================================
# RECOMMENDATION ENGINE
# ==========================================

def generate_recommendation():

    if soil_moisture < 30:
        return (
            "Soil moisture is critically low. "
            "Activate irrigation immediately."
        )

    if temperature > 40:
        return (
            "Heat stress risk detected. "
            "Increase watering frequency."
        )

    if water_level < 20:
        return (
            "Water reservoir level is low. "
            "Refill reservoir soon."
        )

    return (
        "Environmental conditions are healthy. "
        "No immediate action required."
    )


# ==========================================
# CSV SETUP
# ==========================================

if not CSV_FILE.exists():

    with open(CSV_FILE, "w", newline="") as file:

        writer = csv.writer(file)

        writer.writerow([
            "timestamp",
            "temperature",
            "humidity",
            "soil_moisture",
            "light_intensity",
            "water_level",
            "crop_health",
            "risk_score",
            "water_efficiency",
            "pump_status"
        ])


# ==========================================
# MAIN LOOP
# ==========================================

print("AgriSense AI Digital Twin Started...\n")

while True:

    update_environment()

    crop_health = calculate_crop_health()

    risk_score = calculate_risk_score()

    water_efficiency = calculate_water_efficiency(
        risk_score
    )

    pump_status = get_pump_status()

    alerts = generate_alerts()

    recommendation = generate_recommendation()

    timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    payload = {
        "timestamp": timestamp,
        "temperature": temperature,
        "humidity": humidity,
        "soil_moisture": soil_moisture,
        "light_intensity": light_intensity,
        "water_level": water_level,
        "crop_health": crop_health,
        "risk_score": risk_score,
        "water_efficiency": water_efficiency,
        "pump_status": pump_status,
        "alerts": alerts,
        "recommendation": recommendation
    }

    with open(JSON_FILE, "w") as file:
        json.dump(payload, file, indent=4)

    with open(CSV_FILE, "a", newline="") as file:

        writer = csv.writer(file)

        writer.writerow([
            timestamp,
            temperature,
            humidity,
            soil_moisture,
            light_intensity,
            water_level,
            crop_health,
            risk_score,
            water_efficiency,
            pump_status
        ])

    print("=" * 50)
    print("Timestamp:", timestamp)
    print("Temperature:", temperature)
    print("Humidity:", humidity)
    print("Soil Moisture:", soil_moisture)
    print("Water Level:", water_level)
    print("Crop Health:", crop_health)
    print("Risk Score:", risk_score)
    print("Pump:", pump_status)
    print("=" * 50)

    time.sleep(3)