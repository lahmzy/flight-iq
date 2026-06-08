import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from 'src/auth/auth.controller';
import { AuthOnBoardingService } from 'src/auth/service/auth.onboarding.service';
import { CONSTANTS_TOKEN } from 'src/infastructure/config/constants/constants.config';
import { AppConfig } from 'src/infastructure/config/env/env';
import { AuthSignInService } from 'src/auth/service/auth.sigin.service';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService, CONSTANTS_TOKEN],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        secret: configService.get<string>('jwt_secret'),
      }),
    }),
  ],
  providers: [AuthOnBoardingService, AuthSignInService],
})
export class AuthModule {}
