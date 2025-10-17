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
      SELECT avg(active_energy) as active_energy, avg(global_reactive_power) as global_reactive_power, avg(voltage) as voltage, avg(global_intensity) as global_intensity
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId} ${getIntervalFilter(dto)};`;

    return res;
  },

  getSumPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto> {
    const [res] = await sql<[CrunchedDataDto]>`
      SELECT sum(active_energy) as active_energy, sum(global_reactive_power) as global_reactive_power, sum(voltage) as voltage, sum(global_intensity) as global_intensity
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId} ${getIntervalFilter(dto)};`;

    return res;
  },

  getMinPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto> {
    const [res] = await sql<[CrunchedDataDto]>`
      SELECT min(active_energy) as active_energy, min(global_reactive_power) as global_reactive_power, min(voltage) as voltage, min(global_intensity) as global_intensity
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId};`;

    return res;
  },

  getMaxPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto> {
    const [res] = await sql<[CrunchedDataDto]>`
      SELECT max(active_energy) as active_energy, max(global_reactive_power) as global_reactive_power, max(voltage) as voltage, max(global_intensity) as global_intensity
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId} ${getIntervalFilter(dto)};`;
    return res;
  },
};

/**
 * Put inside where clause
 * */
function getIntervalFilter(dto: GetCrunchedDataDto) {
  if (!dto.after && !dto.before) {
    return sql` and true = true `;
  }

  let after = dto.after
    ? sql` and datetime > ${dto.after.toISOString()} `
    : sql``;

  let before = dto.before
    ? sql` and datetime > ${dto.before.toISOString()} `
    : sql``;

  return sql`${after} ${before}`;
}
