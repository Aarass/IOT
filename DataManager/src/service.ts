import * as grpc from "@grpc/grpc-js";
import type { GetCrunchedDataDto } from "../domain/dtos/GetCrunchedDataDto.ts";
import { type IDataManager } from "../grpc/datamanager.grpc-server.ts";
import {
  PowerConsumption,
  PowerConsumptionValues,
  type DeletePowerConsumptionRequest,
  type GetPowerConsumptionRequest,
  type IdWithInterval,
  type PostPowerConsumptionRequest,
  type UpdatePowerConsumptionRequest,
} from "../grpc/datamanager.ts";
import { Timestamp } from "../grpc/google/protobuf/timestamp.ts";
import { dbg } from "../utils/dbg.ts";
import { PowerConsumptionRepository } from "./repositories/PowerConsumptionRepository.ts";

export const dataManagerService: IDataManager = {
  postPowerConsumption: async function (
    call: grpc.ServerUnaryCall<PostPowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ) {
    try {
      const res = await PowerConsumptionRepository.createPowerConsumptionRecord(
        {
          ...call.request,
          datetime: call.request.datetime
            ? Timestamp.toDate(call.request.datetime)
            : new Date(),
        },
      );

      if (res === null) {
        callback(
          new grpc.StatusBuilder().withCode(grpc.status.NOT_FOUND).build(),
        );
      } else {
        callback(
          null,
          PowerConsumption.create({
            ...res,
            datetime: Timestamp.fromDate(res.datetime),
          }),
        );
      }
    } catch (err) {
      dbg(err);
      callback(generateError(err));
    }
  },

  getPowerConsumption: async function (
    call: grpc.ServerUnaryCall<GetPowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ) {
    try {
      const res = await PowerConsumptionRepository.getPowerConsumptionRecord(
        call.request.id,
      );

      if (res === null) {
        callback(
          new grpc.StatusBuilder().withCode(grpc.status.NOT_FOUND).build(),
        );
      } else {
        callback(
          null,
          PowerConsumption.create({
            ...res,
            datetime: Timestamp.fromDate(res.datetime),
          }),
        );
      }
    } catch (err) {
      dbg(err);
      callback(generateError(err));
    }
  },

  deletePowerConsumption: async function (
    call: grpc.ServerUnaryCall<DeletePowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ) {
    try {
      const res = await PowerConsumptionRepository.deletePowerConsumptionRecord(
        call.request.id,
      );

      if (res === null) {
        callback(
          new grpc.StatusBuilder().withCode(grpc.status.NOT_FOUND).build(),
        );
      } else {
        callback(
          null,
          PowerConsumption.create({
            ...res,
            datetime: Timestamp.fromDate(res.datetime),
          }),
        );
      }
    } catch (err) {
      dbg(err);
      callback(generateError(err));
    }
  },

  updatePowerConsumption: async function (
    call: grpc.ServerUnaryCall<UpdatePowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ) {
    try {
      const { datetime, ...rest } = call.request;

      const res = await PowerConsumptionRepository.updatePowerConsumptionRecord(
        {
          ...rest,
          ...(datetime ? { datetime: Timestamp.toDate(datetime) } : {}),
        },
      );

      if (res === null) {
        callback(
          new grpc.StatusBuilder().withCode(grpc.status.NOT_FOUND).build(),
        );
      } else {
        callback(
          null,
          PowerConsumption.create({
            ...res,
            datetime: Timestamp.fromDate(res.datetime),
          }),
        );
      }
    } catch (err) {
      dbg(err);
      callback(generateError(err));
    }
  },

  getAvgPowerConsumption: async function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ) {
    try {
      const dto = dtoFromIdWithInterval(call.request);
      const res = await PowerConsumptionRepository.getAvgPowerConsumption(dto);

      if (res === null) {
        callback(
          new grpc.StatusBuilder().withCode(grpc.status.NOT_FOUND).build(),
        );
      } else {
        callback(null, PowerConsumptionValues.create(res));
      }
    } catch (err) {
      dbg(err);
      callback(generateError(err));
    }
  },

  getSumPowerConsumption: async function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ) {
    try {
      const dto = dtoFromIdWithInterval(call.request);
      const res = await PowerConsumptionRepository.getSumPowerConsumption(dto);

      if (res === null) {
        callback(
          new grpc.StatusBuilder().withCode(grpc.status.NOT_FOUND).build(),
        );
      } else {
        callback(null, PowerConsumptionValues.create(res));
      }
    } catch (err) {
      dbg(err);
      callback(generateError(err));
    }
  },

  getMinPowerConsumption: async function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ) {
    try {
      const dto = dtoFromIdWithInterval(call.request);
      const res = await PowerConsumptionRepository.getMinPowerConsumption(dto);

      if (res === null) {
        callback(
          new grpc.StatusBuilder().withCode(grpc.status.NOT_FOUND).build(),
        );
      } else {
        callback(null, PowerConsumptionValues.create(res));
      }
    } catch (err) {
      dbg(err);
      callback(generateError(err));
    }
  },

  getMaxPowerConsumption: async function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ) {
    try {
      const dto = dtoFromIdWithInterval(call.request);
      const res = await PowerConsumptionRepository.getMaxPowerConsumption(dto);

      if (res === null) {
        callback(
          new grpc.StatusBuilder().withCode(grpc.status.NOT_FOUND).build(),
        );
      } else {
        callback(null, PowerConsumptionValues.create(res));
      }
    } catch (err) {
      dbg(err);
      callback(generateError(err));
    }
  },
};

function dtoFromIdWithInterval(data: IdWithInterval): GetCrunchedDataDto {
  return {
    sensorId: data.id,
    ...(data.after ? { after: Timestamp.toDate(data.after) } : {}),
    ...(data.before ? { before: Timestamp.toDate(data.before) } : {}),
  };
}

function generateError(err: unknown) {
  let details = "Something went wrong.";

  if (err !== null) {
    if (typeof err === "object") {
      if ("message" in err && typeof err["message"] === "string") {
        details = err["message"];
      }
    }
  }

  return new grpc.StatusBuilder()
    .withDetails(details)
    .withCode(grpc.status.INTERNAL)
    .build();
}
