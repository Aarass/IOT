import * as grpc from "@grpc/grpc-js";
import type { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import {
  dataManagerDefinition,
  type IDataManager,
} from "./datamanager.grpc-server.ts";
import type { PowerConsumptionReport } from "./datamanager.ts";
import { Empty } from "./google/protobuf/empty.ts";

const exampleService: IDataManager = {
  postPowerConsumption: function (
    call: ServerUnaryCall<PowerConsumptionReport, Empty>,
    callback: sendUnaryData<Empty>,
  ): void {
    console.log("tu sam");
    callback(null, Empty);
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

