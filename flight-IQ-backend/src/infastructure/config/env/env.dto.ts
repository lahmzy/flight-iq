import { plainToInstance } from 'class-transformer';

import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  STAGING = 'staging',
  SANDBOX = 'sandbox',
}

class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  REDIS_URL: string;

  // @IsString()
  // @IsNotEmpty()
  // EMAIL_PASSWORD: string;

  // @IsString()
  // @IsNotEmpty()
  // EMAIL_USERNAME: string;

  // @IsString()
  // @IsNotEmpty()
  // EMAIL_HOST: string;

  // @IsNumber()
  // EMAIL_PORT: number;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  // @IsString()
  // @IsNotEmpty()
  // AWS_ACCESS_KEY_ID: string;

  // @IsString()
  // @IsNotEmpty()
  // AWS_SECRET_ACCESS_KEY: string;

  // @IsString()
  // @IsNotEmpty()
  // AWS_S3_REGION: string;

  // @IsString()
  // @IsNotEmpty()
  // AWS_BUCKET_NAME: string;

  // @IsString()
  // @IsNotEmpty()
  // GOOGLE_CLIENT_ID: string;
}

export function validateEnv(config: Record<string, string>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      '❌ Environment validation error:\n' +
        errors
          .map((err) => Object.values(err.constraints || {}).join(', '))
          .join('\n'),
    );
  }

  return validatedConfig;
}
