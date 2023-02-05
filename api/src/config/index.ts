import * as dotenv from "dotenv";

dotenv.config();

const { AUTH, DATABASE_URL, PORT } = process.env;

export const withAuth = AUTH === "false";
export const databaseUrl = DATABASE_URL ?? "";
export const port = PORT ?? 9000;
