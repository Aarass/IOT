import "dotenv/config";
import mqtt from "mqtt";
import nats, { StringCodec } from "nats";

const mqttClientId = crypto.randomUUID();

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

//
//

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

//
//

const sc = StringCodec();
const sub = natsClient.subscribe("tmp");

(async () => {
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
  }
  console.log("subscription closed");
})();

natsClient.publish("tmp", sc.encode("world"));
natsClient.publish("tmp", sc.encode("again"));

await natsClient.drain();
