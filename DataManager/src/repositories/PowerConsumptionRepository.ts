import postgres from "postgres";
import type { CreatePowerConsumptionRecordDto } from "../../domain/dtos/CreatePowerConsumptionRecordDto.ts";
import type { GetCrunchedDataDto } from "../../domain/dtos/GetCrunchedDataDto.ts";
import type { UpdatePowerConsumptionRecordDto } from "../../domain/dtos/UpdatePowerConsumptionRecordDto.ts";
import type { PowerConsumption } from "../../domain/models/PowerConsumtion.ts";
import { sql } from "../db/db.ts";
import type { CrunchedDataDto } from "../../domain/dtos/CrunchedDataDto.ts";

export const PowerConsumptionRepository = {
  createPowerConsumptionRecord: async function (
    dto: CreatePowerConsumptionRecordDto,
  ): Promise<PowerConsumption> {
    // const [res] = await sql<[PowerConsumption]>`
    //   INSERT INTO power_consumption (sensor_id, datetime, active_energy, global_reactive_power, voltage, global_intensity)
    //   VALUES(${dto.sensorId}, ${dto.datetime}, ${dto.activeEnergy}, ${dto.globalReactivePower}, ${dto.voltage}, ${dto.globalIntensity})
    //   RETURNING id, sensor_id as "sensorId", datetime, active_energy as "activeEnergy", global_reactive_power as "globalReactivePower", voltage, global_intensity as "globalIntensity";`;

    const [res] = await sql<
      [PowerConsumption]
    >`INSERT INTO power_consumption ${sql(dto)} RETURNING *`;

    return res;
  },

  updatePowerConsumptionRecord: async function (
    dto: UpdatePowerConsumptionRecordDto,
  ): Promise<PowerConsumption> {
    const { id, ...updates } = dto;

    const [res] = await sql<
      [PowerConsumption]
    >`UPDATE power_consumption SET ${sql(updates)} WHERE id = ${id} RETURNING *;`;

    return res;
  },

  deletePowerConsumptionRecord: async function (id: string) {
    const [res] = await sql<
      [PowerConsumption]
    >`DELETE FROM power_consumption WHERE id = ${id} RETURNING *;`;
    return res;
  },

  getPowerConsumptionRecord: async function (id: string) {
    const [res] = await sql<
      [PowerConsumption]
    >`SELECT * FROM power_consumption WHERE id = ${id};`;
    return res;
  },

  getAvgPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto> {
    const [res] = await sql<[CrunchedDataDto]>`
      SELECT avg(active_energy) as active_energy_avg, avg(global_reactive_power) as global_reactive_power_avg, avg(voltage) as voltage_avg, avg(global_intensity) as global_intensity_avg
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId};`;

    return res;
  },

  getSumPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto> {
    const [res] = await sql<[CrunchedDataDto]>`
      SELECT sum(active_energy) as active_energy_sum, sum(global_reactive_power) as global_reactive_power_sum, sum(voltage) as voltage_sum, sum(global_intensity) as global_intensity_sum
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId};`;

    return res;
  },

  getMinPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto> {
    const [res] = await sql<[CrunchedDataDto]>`
      SELECT min(active_energy) as active_energy_min, min(global_reactive_power) as global_reactive_power_min, min(voltage) as voltage_min, min(global_intensity) as global_intensity_min
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId};`;

    return res;
  },

  getMaxPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto> {
    const [res] = await sql<[CrunchedDataDto]>`
      SELECT max(active_energy) as active_energy_max, max(global_reactive_power) as global_reactive_power_max, max(voltage) as voltage_max, max(global_intensity) as global_intensity_max
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId};`;

    return res;
  },
};
