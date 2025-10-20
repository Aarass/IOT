import mqtt from "mqtt";
import nats, { StringCodec } from "nats";

if (process.env.MQTT_HOST === undefined) {
  throw "There is no MQTT_HOST env variable";
}

if (process.env.MQTT_PORT === undefined) {
  throw "There is no MQTT_HOST env variable";
}

if (process.env.NATS_HOST === undefined) {
  throw "There is no NATS_HOST env variable";
}

if (process.env.NATS_PORT === undefined) {
  throw "There is no NATS_HOST env variable";
}

const mqttClientId = crypto.randomUUID();

let mqttClient = await mqtt.connectAsync({
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT),
  clientId: mqttClientId,
  clean: true,
});

console.log("Succesfully connected to the mqqt broker");

const natsClient = await nats.connect({
  servers: `${process.env.NATS_HOST}:${process.env.NATS_PORT}`,
});

console.log("Succesfully connected to the nats broker");

mqttClient.subscribe("powerConsumption");

mqttClient.on("message", (topic, message) => {
  if (topic !== "powerConsumption") {
    console.error("Got message for unexpected topic: " + topic);
  }

  try {
    const data = JSON.parse(message.toString());
    console.log(data);
  } catch (err) {
    console.error("Couldn't parse the message", err);
  }
});

const sc = StringCodec();
natsClient.publish("analytics", sc.encode("analitika"));
