import * as dotenv from "dotenv";

dotenv.config();

const { AUTH, DB_CONNECTION_STRING, PORT } = process.env;

export const withAuth = AUTH === "false";
export const dbConnectionString = DB_CONNECTION_STRING ?? "";
export const port = PORT ?? 9000;
