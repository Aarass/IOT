import postgres from "postgres";

if (process.env.DATABASE_URL === undefined) {
  throw "There is no DATABASE_URL env variable";
}

export const sql = postgres(process.env.DATABASE_URL);
