import { Module, Global } from '@nestjs/common';

import { AppEnvironmentService } from 'src/infastructure/config/common/app.environment.service';

@Global()
@Module({
  providers: [AppEnvironmentService],
  exports: [AppEnvironmentService],
})
export class AppEnvironmentModule {}
