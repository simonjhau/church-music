import dotenv from 'dotenv';

dotenv.config();

export const audience = process.env.AUTH0_AUDIENCE;
export const domain = process.env.AUTH0_DOMAIN;
export const serverPort = process.env.SERVER_PORT;
export const clientOriginUrl = process.env.CLIENT_ORIGIN_URL;

if (!audience) {
  throw new Error(
    '.env is missing the definition of an AUTH0_AUDIENCE environmental variable'
  );
}

if (!domain) {
  throw new Error(
    '.env is missing the definition of an AUTH0_DOMAIN environmental variable'
  );
}

if (!serverPort) {
  throw new Error(
    '.env is missing the definition of a API_PORT environmental variable'
  );
}

if (!clientOriginUrl) {
  throw new Error(
    '.env is missing the definition of a APP_ORIGIN environmental variable'
  );
}

export const clientOrigins = ['http://localhost:3000'];
