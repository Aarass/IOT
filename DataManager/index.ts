import * as grpc from "@grpc/grpc-js";
import {
  dataManagerDefinition,
  type IDataManager,
} from "./datamanager.grpc-server.ts";
import type {
  PostPowerConsumptionRequest,
  PowerConsumption,
  GetPowerConsumptionRequest,
  DeletePowerConsumptionRequest,
  UpdatePowerConsumptionRequest,
  IdWithInterval,
  AvgPowerConsumption,
  SumPowerConsumption,
  MinPowerConsumption,
  MaxPowerConsumption,
} from "./datamanager.ts";

const exampleService: IDataManager = {
  postPowerConsumption: function (
    call: grpc.ServerUnaryCall<PostPowerConsumptionRequest, PowerConsumption>,
    callback: grpc.sendUnaryData<PowerConsumption>,
  ): void {
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
    call: grpc.ServerUnaryCall<IdWithInterval, AvgPowerConsumption>,
    callback: grpc.sendUnaryData<AvgPowerConsumption>,
  ): void {
    throw new Error("Function not implemented.");
  },
  getSumPowerConsumption: function (
    call: grpc.ServerUnaryCall<IdWithInterval, SumPowerConsumption>,
    callback: grpc.sendUnaryData<SumPowerConsumption>,
  ): void {
    throw new Error("Function not implemented.");
  },
  getMinPowerConsumption: function (
    call: grpc.ServerUnaryCall<IdWithInterval, MinPowerConsumption>,
    callback: grpc.sendUnaryData<MinPowerConsumption>,
  ): void {
    throw new Error("Function not implemented.");
  },
  getMaxPowerConsumption: function (
    call: grpc.ServerUnaryCall<IdWithInterval, MaxPowerConsumption>,
    callback: grpc.sendUnaryData<MaxPowerConsumption>,
  ): void {
    throw new Error("Function not implemented.");
  },
};

const server = new grpc.Server();
server.addService(dataManagerDefinition, exampleService);
server.bindAsync(
  "0.0.0.0:5000",
  grpc.ServerCredentials.createInsecure(),
  (err: Error | null, port: number) => {
    if (err) {
      console.error(`Server error: ${err.message}`);
    } else {
      console.log(`Server bound on port: ${port}`);
    }
  },
);
