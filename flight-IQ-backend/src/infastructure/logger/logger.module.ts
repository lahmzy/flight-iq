import { Global, Module } from '@nestjs/common';

import { AppLogger } from 'src/infastructure/logger/app.logger';

@Global()
@Module({
  // imports: [QueueModule],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
