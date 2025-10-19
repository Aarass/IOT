import type { CreatePowerConsumptionRecordDto } from "../../domain/dtos/CreatePowerConsumptionRecordDto.ts";
import type { CrunchedDataDto } from "../../domain/dtos/CrunchedDataDto.ts";
import type { GetCrunchedDataDto } from "../../domain/dtos/GetCrunchedDataDto.ts";
import type { UpdatePowerConsumptionRecordDto } from "../../domain/dtos/UpdatePowerConsumptionRecordDto.ts";
import type { PowerConsumption } from "../../domain/models/PowerConsumtion.ts";
import { sql } from "../db/db.ts";

export const PowerConsumptionRepository = {
  createPowerConsumptionRecord: async function (
    dto: CreatePowerConsumptionRecordDto,
  ): Promise<PowerConsumption | null> {
    try {
      const rows = await sql<
        [PowerConsumption]
      >`INSERT INTO power_consumption ${sql(dto)} RETURNING *`;

      if (rows.length === 1) {
        return rows[0];
      } else if (rows.length === 0) {
        return null;
      } else {
        throw "Internal error. Something went realy wrong";
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  updatePowerConsumptionRecord: async function (
    dto: UpdatePowerConsumptionRecordDto,
  ): Promise<PowerConsumption | null> {
    try {
      const { id, ...updates } = dto;

      const rows = await sql<
        [PowerConsumption]
      >`UPDATE power_consumption SET ${sql(updates)} WHERE id = ${id} RETURNING *;`;

      if (rows.length === 1) {
        return rows[0];
      } else if (rows.length === 0) {
        return null;
      } else {
        throw "Internal error. Something went realy wrong";
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  deletePowerConsumptionRecord: async function (
    id: string,
  ): Promise<PowerConsumption | null> {
    try {
      const rows = await sql<
        [PowerConsumption]
      >`DELETE FROM power_consumption WHERE id = ${id} RETURNING *;`;

      if (rows.length === 1) {
        return rows[0];
      } else if (rows.length === 0) {
        return null;
      } else {
        throw "Internal error. Something went realy wrong";
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  getPowerConsumptionRecord: async function (
    id: string,
  ): Promise<PowerConsumption | null> {
    try {
      const rows = await sql<
        [PowerConsumption]
      >`SELECT * FROM power_consumption WHERE id = ${id};`;

      if (rows.length === 1) {
        return rows[0];
      } else if (rows.length === 0) {
        return null;
      } else {
        throw "Internal error. Something went realy wrong";
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  getAvgPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto | null> {
    try {
      const rows = await sql<[CrunchedDataDto]>`
      SELECT avg(active_energy) as active_energy, avg(global_reactive_power) as global_reactive_power, avg(voltage) as voltage, avg(global_intensity) as global_intensity
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId} ${getIntervalFilter(dto)};`;

      if (rows.length === 1) {
        return rows[0];
      } else if (rows.length === 0) {
        return null;
      } else {
        throw "Internal error. Something went realy wrong";
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  getSumPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto | null> {
    try {
      const rows = await sql<[CrunchedDataDto]>`
      SELECT sum(active_energy) as active_energy, sum(global_reactive_power) as global_reactive_power, sum(voltage) as voltage, sum(global_intensity) as global_intensity
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId} ${getIntervalFilter(dto)};`;

      if (rows.length === 1) {
        return rows[0];
      } else if (rows.length === 0) {
        return null;
      } else {
        throw "Internal error. Something went realy wrong";
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  getMinPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto | null> {
    try {
      const rows = await sql<[CrunchedDataDto]>`
      SELECT min(active_energy) as active_energy, min(global_reactive_power) as global_reactive_power, min(voltage) as voltage, min(global_intensity) as global_intensity
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId};`;

      if (rows.length === 1) {
        return rows[0];
      } else if (rows.length === 0) {
        return null;
      } else {
        throw "Internal error. Something went realy wrong";
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  getMaxPowerConsumption: async function (
    dto: GetCrunchedDataDto,
  ): Promise<CrunchedDataDto | null> {
    try {
      const rows = await sql<[CrunchedDataDto]>`
      SELECT max(active_energy) as active_energy, max(global_reactive_power) as global_reactive_power, max(voltage) as voltage, max(global_intensity) as global_intensity
      FROM power_consumption
      WHERE sensor_id = ${dto.sensorId} ${getIntervalFilter(dto)};`;

      if (rows.length === 1) {
        return rows[0];
      } else if (rows.length === 0) {
        return null;
      } else {
        throw "Internal error. Something went realy wrong";
      }
    } catch (err) {
      console.error(err);
      return null;
    }
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
    ? sql` and datetime < ${dto.before.toISOString()} `
    : sql``;

  return sql`${after} ${before}`;
}
