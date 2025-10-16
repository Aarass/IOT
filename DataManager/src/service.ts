import * as grpc from "@grpc/grpc-js";
import { type IDataManager } from "../grpc/datamanager.grpc-server.ts";
import {
  PowerConsumption,
  type DeletePowerConsumptionRequest,
  type GetPowerConsumptionRequest,
  type IdWithInterval,
  type PostPowerConsumptionRequest,
  type PowerConsumptionValues,
  type UpdatePowerConsumptionRequest,
} from "../grpc/datamanager.ts";

export const dataManagerService: IDataManager = {
  postPowerConsumption: function (
    call: grpc.ServerUnaryCall<PostPowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ): void {
    callback(null, PowerConsumption.create({ id: "1" }));
    throw new Error("Function not implemented.");
  },
  getPowerConsumption: function (
    call: grpc.ServerUnaryCall<GetPowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ): void {
    throw new Error("Function not implemented.");
  },
  deletePowerConsumption: function (
    call: grpc.ServerUnaryCall<DeletePowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ): void {
    throw new Error("Function not implemented.");
  },
  updatePowerConsumption: function (
    call: grpc.ServerUnaryCall<UpdatePowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ): void {
    throw new Error("Function not implemented.");
  },
  getAvgPowerConsumption: function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ): void {
    throw new Error("Function not implemented.");
  },
  getSumPowerConsumption: function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ): void {
    throw new Error("Function not implemented.");
  },
  getMinPowerConsumption: function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ): void {
    throw new Error("Function not implemented.");
  },
  getMaxPowerConsumption: function (
    call: grpc.ServerUnaryCall<IdWithInterval, PowerConsumptionValues>,
    callback: grpc.sendUnaryData<PowerConsumptionValues>,
  ): void {
    throw new Error("Function not implemented.");
  },
};
