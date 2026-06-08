import { ConfigModuleOptions } from '@nestjs/config';

import appConfiguration from 'src/infastructure/config/env/app.configuration';
import { validateEnv } from 'src/infastructure/config/env/env.dto';

const environment = process.env.NODE_ENV || 'development';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  validate: validateEnv,
  envFilePath: [`.env.${environment}`, '.env'],
  load: [appConfiguration],
};
