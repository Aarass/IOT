import * as grpc from "@grpc/grpc-js";
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
import { PowerConsumptionRepository } from "./repositories/PowerConsumptionRepository.ts";
import { Timestamp } from "../grpc/google/protobuf/timestamp.ts";

export const dataManagerService: IDataManager = {
  postPowerConsumption: async function (
    call: grpc.ServerUnaryCall<PostPowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ) {
    const res = await PowerConsumptionRepository.createPowerConsumptionRecord({
      ...call.request,
      datetime: call.request.datetime
        ? Timestamp.toDate(call.request.datetime)
        : new Date(),
    });

    callback(
      null,
      PowerConsumption.create({
        ...res,
        datetime: Timestamp.fromDate(res.datetime),
      }),
    );
  },

  getPowerConsumption: async function (
    call: grpc.ServerUnaryCall<GetPowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ) {
    const res = await PowerConsumptionRepository.getPowerConsumptionRecord(
      call.request.id,
    );

    callback(
      null,
      PowerConsumption.create({
        ...res,
        datetime: Timestamp.fromDate(res.datetime),
      }),
    );
  },

  deletePowerConsumption: async function (
    call: grpc.ServerUnaryCall<DeletePowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ) {
    const res = await PowerConsumptionRepository.deletePowerConsumptionRecord(
      call.request.id,
    );

    callback(
      null,
      PowerConsumption.create({
        ...res,
        datetime: Timestamp.fromDate(res.datetime),
      }),
    );
  },

  updatePowerConsumption: async function (
    call: grpc.ServerUnaryCall<UpdatePowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ) {
    const { datetime, ...rest } = call.request;

    const res = await PowerConsumptionRepository.updatePowerConsumptionRecord({
      ...rest,
      ...(datetime ? { datetime: Timestamp.toDate(datetime) } : {}),
    });

    callback(
      null,
      PowerConsumption.create({
        ...res,
        datetime: Timestamp.fromDate(res.datetime),
      }),
    );
  },

  getAvgPowerConsumption: async function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ) {
    const dto = DtoFromIdWithInterval(call.request);
    const res = await PowerConsumptionRepository.getAvgPowerConsumption(dto);

    callback(null, PowerConsumptionValues.create(res));
  },

  getSumPowerConsumption: async function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ) {
    const dto = DtoFromIdWithInterval(call.request);
    const res = await PowerConsumptionRepository.getSumPowerConsumption(dto);

    callback(null, PowerConsumptionValues.create(res));
  },

  getMinPowerConsumption: async function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ) {
    const dto = DtoFromIdWithInterval(call.request);
    const res = await PowerConsumptionRepository.getMinPowerConsumption(dto);

    callback(null, PowerConsumptionValues.create(res));
  },

  getMaxPowerConsumption: async function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ) {
    const dto = DtoFromIdWithInterval(call.request);
    const res = await PowerConsumptionRepository.getMaxPowerConsumption(dto);

    callback(null, PowerConsumptionValues.create(res));
  },
};

function DtoFromIdWithInterval(data: IdWithInterval) {
  return {
    sensorId: data.id,
    after: data.after ? Timestamp.toDate(data.after) : undefined,
    before: data.before ? Timestamp.toDate(data.before) : undefined,
  };
}
