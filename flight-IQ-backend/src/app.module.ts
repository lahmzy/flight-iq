import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';

import { LoggerMiddleware } from 'src/infastructure/logger/logger.middlware';
import { configModuleOptions } from 'src/infastructure/config/env/env.config';
import { AppEnvironmentModule } from 'src/infastructure/config/common/app.environment.module';
// import { MailerModule } from 'src/infastructure/services/mailer/mailer.module';
import { PrismaModule } from 'src/infastructure/services/prisma/prisma.module';
import { ConstantsModule } from 'src/infastructure/config/constants/constants.module';
import { cacheModuleConfig } from 'src/infastructure/config/redis/cache.config';
import { LoggerModule } from 'src/infastructure/logger/logger.module';
// import { WebhookModule } from 'src/webhook/webhook.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { IncidentModule } from 'src/incident/incident.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    LoggerModule,
    ConstantsModule,
    ConfigModule.forRoot(configModuleOptions),
    CacheModule.registerAsync(cacheModuleConfig()),
    AppEnvironmentModule,
    // MailerModule,
    PrismaModule,

    // app modules
    // WebhookModule,
    AuthModule,
    UserModule,
    IncidentModule,
  ],
  controllers: [],
  providers: [
    // JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
