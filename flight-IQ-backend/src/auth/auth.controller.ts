import { Controller, Post, Body, Ip } from '@nestjs/common';

import { GoogleOAuthTokenDto } from 'src/auth/auth.dto';
import { AuthOnBoardingService } from 'src/auth/service/auth.onboarding.service';
import { Device, DeviceData } from 'src/common/decorator/device.decorator';
import { AuthSignInService } from 'src/auth/service/auth.sigin.service';
import { IsPublic } from 'src/auth/auth.decorator';

@Controller('auth')
@IsPublic()
export class AuthController {
  constructor(
    private readonly authOnBoardingService: AuthOnBoardingService,
    private readonly authSignInService: AuthSignInService,
  ) {}

  @Post('google/signup')
  async signUpWithGoogle(
    @Body() googleOAuthTokenDto: GoogleOAuthTokenDto,
    @Device() deviceData: DeviceData,
    @Ip() ipAddress: string,
  ) {
    return this.authOnBoardingService.signUpWithGoogleService({
      googleOAuthTokenDto,
      deviceData,
      ipAddress,
    });
  }

  @Post('google/signin')
  async signInWithGoogle(
    @Body() googleOAuthTokenDto: GoogleOAuthTokenDto,
    @Device() deviceData: DeviceData,
    @Ip() ipAddress: string,
  ) {
    return this.authSignInService.signInWithGoogleService({
      googleOAuthTokenDto,
      deviceData,
      ipAddress,
    });
  }
}
