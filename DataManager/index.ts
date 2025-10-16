import * as grpc from "@grpc/grpc-js";
import { dataManagerDefinition } from "./grpc/datamanager.grpc-server";
import { dataManagerService } from "./src/service";

const server = new grpc.Server();
server.addService(dataManagerDefinition, dataManagerService);
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
