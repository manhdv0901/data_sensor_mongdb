#include <DHT.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#define DHTPIN D3 // Chân dữ liệu của DHT11 kết nối với GPIO4 của ESP8266
#define DHTTYPE DHT11 // Loại DHT được sử dụng
DHT dht(DHTPIN, DHTTYPE);

WiFiClient wifiClient;
HTTPClient http;

//wifi
const char* ssid = "manhhang0901";
const char* password = "123456789";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
   dht.begin(); // Khởi tạo DHT1 11 để truyền nhận dữ liệu
  // connect wifi
  Serial.println("Connecting");
  // Thiết lập ESP8266 là Station và kết nối đến Wifi. in ra dấu `.` trên terminal nếu chưa được kết nối
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.println("\r\nWiFi connected");

}

void sendRequest(float temperature, float humidity, float spo2){
//  if(WiFi.status() == WL_CONNECTED) {
    
    http.begin(wifiClient ,"http://192.168.1.105:3000/dht11?temperature=" + String(temperature) + "&humidity=" + String(humidity) + "&sp02=" + String(spo2));
    http.addHeader("Content-Type", "text/plain");

    int httpResponseCode = http.POST("request create dht11 data");
    if(httpResponseCode == 200){
      Serial.println("Send DHT11 data to server\n");
    }else{
      Serial.println("Can't send DHT11 data to sever\n");
      }
//  }
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(5000);

  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float spo2 = 95;
  if(isnan(h) || isnan(t)){
    Serial.println(F("Failed to read from DHT Sensor"));
    return;
  }

  Serial.print(F("Temperature: "));
  Serial.print(t);
  Serial.print(F("*C"));
  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%"));
  Serial.print(spo2);
  Serial.print(F("%"));

  sendRequest(t, h, spo2);

}
