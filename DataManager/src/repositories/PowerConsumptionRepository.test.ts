import { expect, test } from "bun:test";
import { PowerConsumptionRepository } from "./PowerConsumptionRepository";

test.failing("post", async () => {
  await PowerConsumptionRepository.createPowerConsumptionRecord({
    sensorId: "1",
    datetime: new Date(),
    activeEnergy: 50,
    voltage: 240,
    globalReactivePower: 0.05,
    globalIntensity: 10,
  });
});
