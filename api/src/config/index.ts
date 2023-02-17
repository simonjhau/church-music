import * as dotenv from "dotenv";

dotenv.config();

const {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AUTH,
  AUTH0_AUDIENCE,
  AUTH0_DOMAIN,
  DATABASE_URL,
  PORT,
} = process.env;

export const withAuth = AUTH === "false";
export const auth0Audience = AUTH0_AUDIENCE ?? "";
export const auth0Domain = AUTH0_DOMAIN ?? "";

export const databaseUrl = DATABASE_URL ?? "";
export const port = PORT ?? 9000;

export const bucketName = AWS_BUCKET_NAME ?? "";
export const region = AWS_BUCKET_REGION ?? "";
export const accessKeyId = AWS_ACCESS_KEY ?? "";
export const secretAccessKey = AWS_SECRET_KEY ?? "";
