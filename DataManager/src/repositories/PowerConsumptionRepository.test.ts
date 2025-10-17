import { expect, test } from "bun:test";
import { PowerConsumptionRepository } from "./PowerConsumptionRepository";

let id: string;
test("post", async () => {
  const res = await PowerConsumptionRepository.createPowerConsumptionRecord({
    sensorId: "1",
    datetime: new Date(),
    activeEnergy: 50,
    voltage: 240,
    globalReactivePower: 0.05,
    globalIntensity: 10,
  });

  expect(res.id).not.toBeUndefined();
  expect(res.datetime).not.toBeFalsy(); // <-- TODO
  expect(res.sensorId).toBe("1");
  expect(res.activeEnergy).toBe(50);
  expect(res.voltage).toBe(240);
  expect(res.globalReactivePower).toBe(0.05);
  expect(res.globalIntensity).toBe(10);

  id = res.id;
});

test("get", async () => {
  const res = await PowerConsumptionRepository.getPowerConsumptionRecord(id);

  expect(res.id).not.toBeUndefined();
  expect(res.datetime).not.toBeFalsy();
  expect(res.sensorId).toBe("1");
  expect(res.activeEnergy).toBe(50);
  expect(res.voltage).toBe(240);
  expect(res.globalReactivePower).toBe(0.05);
  expect(res.globalIntensity).toBe(10);
});

test("update", async () => {
  const updates = {
    sensorId: "2",
    datetime: new Date(),
    activeEnergy: 51,
    voltage: 241,
    globalReactivePower: 1.05,
    globalIntensity: 11,
  } as const;

  const updatedPCR =
    await PowerConsumptionRepository.updatePowerConsumptionRecord({
      id: id,
      ...updates,
    });

  const gottenPCR =
    await PowerConsumptionRepository.getPowerConsumptionRecord(id);

  for (const _key of Object.keys(updates)) {
    const key = _key as keyof typeof updates;

    // console.log(updatedPCR[key], gottenPCR[key], updates[key]);

    expect(updatedPCR[key]).toEqual(updates[key]);
    expect(gottenPCR[key]).toEqual(updates[key]);
  }
});

test("delete", async () => {
  const res = await PowerConsumptionRepository.deletePowerConsumptionRecord(id);

  expect(res.id).toBe(id);
  expect(res.datetime).not.toBeFalsy();
  expect(res.sensorId).toBe("2");
  expect(res.activeEnergy).toBe(51);
  expect(res.voltage).toBe(241);
  expect(res.globalReactivePower).toBe(1.05);
  expect(res.globalIntensity).toBe(11);
});

test.skip("avg", async () => {
  const res = await PowerConsumptionRepository.getAvgPowerConsumption({
    sensorId: "2",
  });

  console.log(res);
});

test.skip("sum", async () => {
  const res = await PowerConsumptionRepository.getSumPowerConsumption({
    sensorId: "2",
  });

  console.log(res);
});

test.skip("min", async () => {
  const res = await PowerConsumptionRepository.getMinPowerConsumption({
    sensorId: "2",
  });

  console.log(res);
});

test.skip("max", async () => {
  const res = await PowerConsumptionRepository.getMaxPowerConsumption({
    sensorId: "2",
  });

  console.log(res);
});
