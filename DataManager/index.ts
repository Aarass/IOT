import * as grpc from "@grpc/grpc-js";
import "dotenv/config";
import { dataManagerDefinition } from "./grpc/datamanager.grpc-server";
import { dataManagerService } from "./src/service";

const addr = `0.0.0.0:${process.env.PORT ?? "5001"}`;
const creds = grpc.ServerCredentials.createInsecure();

const server = new grpc.Server();

server.addService(dataManagerDefinition, dataManagerService);
server.bindAsync(addr, creds, onStart);

function onStart(err: Error | null, port: number) {
  if (err) {
    console.error(`Server error: ${err.message}`);
  } else {
    console.log(`Server bound on port: ${port}`);
  }
}
