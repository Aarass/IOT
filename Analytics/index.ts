import mqtt from "mqtt";
import nats, { JSONCodec } from "nats";
import { BatchBuffer } from "./batch";
import type { AnalysisResult } from "./AnalysisResult";

const [mqttClient, natsClient, mlaasURL] = await connect();

const encoder = JSONCodec();
const buffer = new BatchBuffer<object>(60, onFull);

mqttClient.subscribe("powerConsumption");
mqttClient.on("message", (topic, message) =>
  topic === "powerConsumption"
    ? onPowerConsumption(message)
    : console.log("Got message for topic", topic),
);

async function onPowerConsumption(message: Buffer<ArrayBufferLike>) {
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
}

async function onFull(data: object[]) {
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
}

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

async function connect() {
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

  const mqttClient = await mqtt.connectAsync({
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

  return [mqttClient, natsClient, mlaasURL] as const;
}

// function logAvg(objs: object[]) {
//   const data = objs as { activeEnergy: number }[];
//
//   const avg =
//     data.map((x) => x.activeEnergy).reduce((sum, val) => sum + val, 0) /
//     data.length;
//
//   console.log(avg);
// }
