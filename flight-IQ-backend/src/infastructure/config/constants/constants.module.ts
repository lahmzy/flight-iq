import { Global, Module } from '@nestjs/common';
import {
  APP_CONSTANTS,
  CONSTANTS_TOKEN,
} from 'src/infastructure/config/constants/constants.config';

@Global()
@Module({
  providers: [
    {
      provide: CONSTANTS_TOKEN,
      useValue: APP_CONSTANTS,
    },
  ],
  exports: [CONSTANTS_TOKEN],
})
export class ConstantsModule {}
