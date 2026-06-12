#include <DHTesp.h>

#define DHTPIN 4

#define SOIL_PIN 34
#define WATER_PIN 35
#define LDR_PIN 15

#define PUMP_PIN 25

DHTesp dhtSensor;

float temperature;
float humidity;

int soilValue;
int waterValue;
int lightValue;

bool pumpStatus = false;

int convertToPercentage(int value)
{
  return map(value, 0, 4095, 0, 100);
}

void readSensors()
{
  TempAndHumidity data = dhtSensor.getTempAndHumidity();

  temperature = data.temperature;
  humidity = data.humidity;

  soilValue = analogRead(SOIL_PIN);
  waterValue = analogRead(WATER_PIN);
  lightValue = analogRead(LDR_PIN);
}

void irrigationLogic()
{
  int soilPercent = convertToPercentage(soilValue);

  if (soilPercent < 30)
  {
    pumpStatus = true;
    digitalWrite(PUMP_PIN, HIGH);
  }
  else
  {
    pumpStatus = false;
    digitalWrite(PUMP_PIN, LOW);
  }
}

void printAlerts()
{
  int soilPercent = convertToPercentage(soilValue);
  int waterPercent = convertToPercentage(waterValue);

  if (soilPercent < 30)
  {
    Serial.println("ALERT: Water Stress Detected");
  }

  if (temperature > 40)
  {
    Serial.println("ALERT: High Temperature Detected");
  }

  if (waterPercent < 20)
  {
    Serial.println("ALERT: Low Water Reservoir");
  }
}

void printReport()
{
  Serial.println();
  Serial.println("================================");

  Serial.print("Temperature : ");
  Serial.print(temperature);
  Serial.println(" C");

  Serial.print("Humidity : ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Soil Moisture : ");
  Serial.print(convertToPercentage(soilValue));
  Serial.println(" %");

  Serial.print("Water Level : ");
  Serial.print(convertToPercentage(waterValue));
  Serial.println(" %");

  Serial.print("Light Level : ");
  Serial.print(convertToPercentage(lightValue));
  Serial.println(" %");

  Serial.print("Pump Status : ");

  if (pumpStatus)
  {
    Serial.println("ACTIVE");
  }
  else
  {
    Serial.println("STANDBY");
  }

  Serial.println("================================");
}

void setup()
{
  Serial.begin(115200);

  dhtSensor.setup(DHTPIN, DHTesp::DHT22);

  pinMode(PUMP_PIN, OUTPUT);

  digitalWrite(PUMP_PIN, LOW);

  Serial.println("================================");
  Serial.println("TerraPulse Monitor Started");
  Serial.println("================================");
}

void loop()
{
  readSensors();

  irrigationLogic();

  printAlerts();

  printReport();

  delay(3000);
}