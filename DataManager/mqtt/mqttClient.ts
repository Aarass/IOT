import mqtt from "mqtt";

if (process.env.MQTT_HOST === undefined) {
  throw "There is no MQTT_HOST env variable";
}

if (process.env.MQTT_PORT === undefined) {
  throw "There is no MQTT_HOST env variable";
}

export const mqttClient = await mqtt.connectAsync({
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT),
  clientId: "data_manager",
  clean: true,
});
