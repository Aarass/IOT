import mqtt from "mqtt";

const mqttClientId = crypto.randomUUID();

let mqttClient = await mqtt.connectAsync({
  host: "localhost",
  port: 1883,
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

