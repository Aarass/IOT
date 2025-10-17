import "dotenv/config";
import * as grpc from "@grpc/grpc-js";
import { dataManagerDefinition } from "./grpc/datamanager.grpc-server";
import { dataManagerService } from "./src/service";
import { sql } from "./src/db/db.ts";
import {
  PostPowerConsumptionRequest,
  type PowerConsumption,
} from "./grpc/datamanager.ts";

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
//
// // await sql`SELECT 1`;
//
// const row_list = await sql<[PowerConsumption]>`
//     INSERT INTO power_consumption (sensor_id, datetime, active_energy, global_reactive_power, voltage, global_intensity)
//     VALUES(1, '2025-10-27 10:00:00', 50, 0.05, 240, 10)
//     RETURNING *`;
//
// const pc = row_list[0];
//
// console.log(pc.id);
