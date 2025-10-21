import mqtt from "mqtt";
import nats, { JSONCodec } from "nats";
import { BatchBuffer } from "./batch";

const encoder = JSONCodec();

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

if (process.env.MLAAS_HOST === undefined) {
  throw "There is no NATS_HOST env variable";
}

if (process.env.MLAAS_PORT === undefined) {
  throw "There is no NATS_HOST env variable";
}

const mlaasURL = `${process.env.MLAAS_HOST}:${process.env.MLAAS_PORT}/predict`;
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

const buffer = new BatchBuffer<object>(60, async (data) => {
  console.log("Batch full");
  try {
    const res = await analyze({
      items: data,
    });

    if (res) {
      console.log(res);
      natsClient.publish("analytics", encoder.encode(res));
    } else {
      console.error("No analysis result");
    }
  } catch (err) {
    console.error(err);
  }
});

mqttClient.subscribe("powerConsumption");

mqttClient.on("message", (topic, message) => {
  if (topic !== "powerConsumption") {
    console.error("Got message for unexpected topic: " + topic);
  }

  try {
    const data = JSON.parse(message.toString()) as object;

    if (typeof data !== "object") {
      console.error("Internal error");
      return;
    }

    buffer.add(data);
  } catch (err) {
    console.error("Couldn't parse the message", err);
  }
});

async function analyze(body: any): Promise<AnalysisResult | null> {
  const request = new Request(mlaasURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  try {
    const response = await fetch(request);
    const result = await response.json();

    if (response.ok) {
      return result as AnalysisResult;
    } else {
      throw new Error(`Analysis did not succeed`, {
        cause: (result as any).detail[0],
      });
    }
  } catch (err) {
    console.error(err);
    if ((err as any)["cause"] !== undefined) {
      console.dir((err as any).cause);
    }
    return null;
  }
}

interface AnalysisResult {
  predict: number;
}
