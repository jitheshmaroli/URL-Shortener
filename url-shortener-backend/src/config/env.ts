import dotenv from 'dotenv';
import path from 'path';

const nodeEnv = process.env.NODE_ENV;

const envFile =
  nodeEnv === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

function requiredEnv(variableName: string): string {
  const value = process.env[variableName];
  if (!value) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
  return value;
}

export const env = {
  MONGODB_URI: requiredEnv('MONGODB_URI'),
  JWT_SECRET: requiredEnv('JWT_SECRET'),
  PORT: Number(requiredEnv('PORT')),
  CLIENT_URL: requiredEnv('CLIENT_URL'),
  BASE_URL: requiredEnv('BASE_URL'),
  NODE_ENV: requiredEnv('NODE_ENV'),
  JWT_REFRESH_SECRET: requiredEnv('JWT_REFRESH_SECRET'),
};
