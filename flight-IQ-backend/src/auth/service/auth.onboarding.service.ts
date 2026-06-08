import { Injectable } from '@nestjs/common';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';
import { GoogleOAuthTokenDto } from 'src/auth/auth.dto';
import { AppConfig } from 'src/infastructure/config/env/env';
import { AuthSignInService } from 'src/auth/service/auth.sigin.service';
import {
  AuthenticationMethod,
  PrismaClient,
  User,
} from 'prisma/generated/prisma/client';
import { AppLogger } from 'src/infastructure/logger/app.logger';
import { DeviceData } from 'src/common/decorator/device.decorator';

@Injectable()
export class AuthOnBoardingService {
  private googleClient = new OAuth2Client();

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly signInService: AuthSignInService,
    private readonly logger: AppLogger,
  ) {}

  async signUpWithGoogleService({
    googleOAuthTokenDto,
    ipAddress,
    deviceData,
  }: {
    googleOAuthTokenDto: GoogleOAuthTokenDto;
    ipAddress: string;
    deviceData: DeviceData;
  }) {
    const clientId = this.configService.get('google_client_id') as string;

    let ticket: LoginTicket | null = null;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: googleOAuthTokenDto.google_token,
        audience: clientId,
      });
    } catch (err) {
      void err;
    }

    if (!ticket) {
      throw new BadRequestException('Invalid Google token');
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new BadRequestException('Invalid Google token');
    }

    const now = new Date();

    const [user, device] = await this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new BadRequestException(
          'An account with this email already exists.',
        );
      }

      const userData = await this.createNewUser(tx as PrismaClient, {
        email: payload.email || '',
        first_name: payload.given_name || '',
        last_name: payload.family_name || '',
        auth_method: AuthenticationMethod.google,
        mail_verified_at: now,
        account_setup_completed_at: now,
      });

      const newDevice = await tx.device.create({
        data: {
          user_id: userData.id,
          device_name: deviceData.name,
          finger_print: deviceData.fingerPrint,
          type: deviceData.type,
          brand: deviceData.brand,
        },
      });
      return [userData, newDevice];
    });

    return this.signInService._SignIn({
      user,
      deviceId: device.id,
      deviceName: device.device_name,
      ipAddress,
    });
  }

  private async createNewUser(
    tx: PrismaClient,
    userData: Pick<
      User,
      | 'email'
      | 'first_name'
      | 'last_name'
      | 'mail_verified_at'
      | 'auth_method'
      | 'account_setup_completed_at'
    >,
  ) {
    return tx.user.create({
      data: {
        email: userData.email.toLowerCase(),
        first_name: userData.first_name,
        last_name: userData.last_name,
        mail_verified_at: userData.mail_verified_at,
        account_setup_completed_at: userData.account_setup_completed_at,
        auth_method: userData.auth_method,
      },
    });
  }
}
