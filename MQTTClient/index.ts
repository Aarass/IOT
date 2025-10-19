import mqtt from "mqtt";
import "dotenv/config";

const mqttClientId = crypto.randomUUID();

if (process.env.MQTT_HOST === undefined) {
  throw "There is no MQTT_HOST env variable";
}

if (process.env.MQTT_PORT === undefined) {
  throw "There is no MQTT_HOST env variable";
}

let mqttClient = await mqtt.connectAsync({
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT),
  clientId: mqttClientId,
  clean: true,
});

mqttClient.subscribeAsync("abnormal");

mqttClient.on("message", (topic, message) => {
  if (topic !== "abnormal") {
    console.error("Got message for unexpected topic: " + topic);
  }

  try {
    const data = JSON.parse(message.toString());
    console.log(data);
  } catch (err) {
    console.error("Coulnd't parse the message", err);
  }
});

