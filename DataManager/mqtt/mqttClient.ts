import mqtt from "mqtt";

export const mqttClient = await mqtt.connectAsync({
  host: "localhost",
  port: 1883,
  clientId: "data_manager",
  clean: true,
});
