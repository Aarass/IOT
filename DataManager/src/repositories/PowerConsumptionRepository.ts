import type { CreatePowerConsumptionRecordDto } from "../../domain/dtos/CreatePowerConsumptionRecordDto.ts";
import type { GetCrunchedDataDto } from "../../domain/dtos/GetCrunchedDataDto.ts";
import type { UpdatePowerConsumptionRecordDto } from "../../domain/dtos/UpdatePowerConsumptionRecordDto.ts";
import type { PowerConsumption } from "../../domain/models/PowerConsumtion.ts";
import { sql } from "../db/db.ts";

// Considering this is a very small project, I've made a conscious decision to use
// the same interfaces from gRPC for the repository methods. Creating separate
// domain interfaces would be cleaner, but I wouldn’t get much value out of it.

export const PowerConsumptionRepository = {
  createPowerConsumptionRecord: async function (
    dto: CreatePowerConsumptionRecordDto,
  ): Promise<PowerConsumption> {
    const rows = await sql<[PowerConsumption]>`
      INSERT INTO power_consumption (sensor_id, datetime, active_energy, global_reactive_power, voltage, global_intensity) 
      VALUES(${dto.sensorId}, ${dto.datetime}, ${dto.activeEnergy}, ${dto.globalReactivePower}, ${dto.voltage}, ${dto.globalIntensity})
      RETURNING id, sensor_id as "sensorId", datetime, active_energy as "activeEnergy", global_reactive_power as "globalReactivePower", voltage, global_intensity as "globalIntensity";`;

    return rows[0];
  },

  updatePowerConsumptionRecord: async function (
    dto: UpdatePowerConsumptionRecordDto,
  ) {},
  deletePowerConsumptionRecord: async function (id: string) {},
  getPowerConsumptionRecord: async function (id: string) {},

  getAvgPowerConsumption: async function (dto: GetCrunchedDataDto) {},
  getSumPowerConsumption: async function (dto: GetCrunchedDataDto) {},
  getMinPowerConsumption: async function (dto: GetCrunchedDataDto) {},
  getMaxPowerConsumption: async function (dto: GetCrunchedDataDto) {},
};
