import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

import {
  AccountStatus,
  AuthenticationMethod,
  Device,
  User,
  UserRole,
} from 'prisma/generated/prisma/browser';
import { AppLogger } from 'src/infastructure/logger/app.logger';
import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';
import { GoogleOAuthTokenDto } from 'src/auth/auth.dto';
import { AppConfig } from 'src/infastructure/config/env/env';
import {
  calculateDate,
  captureFirstDigit,
  convertSecondsToMilliseconds,
  parseExpirationToSeconds,
} from 'src/utility/time.utility';
import {
  AppConstants,
  CONSTANTS_TOKEN,
} from 'src/infastructure/config/constants/constants.config';
import {
  AccessTokenPayloadMetaData,
  CacheTokenMetaData,
  RefreshTokenPayloadMetaData,
  UserMetaData,
} from 'src/auth/auth.types';
import { DeviceData } from 'src/common/decorator/device.decorator';

@Injectable()
export class AuthSignInService {
  private googleClient = new OAuth2Client();

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    @Inject(CONSTANTS_TOKEN)
    private readonly constantsConfig: AppConstants,

    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async _SignIn({
    user,
    deviceId,
    ipAddress,
    deviceName,
  }: {
    user: User;
    deviceId: string;
    ipAddress: string;
    deviceName: string;
  }) {
    if (user.status !== AccountStatus.active) {
      throw new ForbiddenException(
        'Account is temporarily suspended, reach out to support',
      );
    }

    const iat = Math.floor(Date.now() / 1000);

    const refreshToken = await this._createRefreshToken(user.id, user.role);

    const session = await this.createSession({
      user,
      deviceId,
      ipAddress,
      refreshToken,
    });

    const accessToken = await this._createAccessToken(
      user.id,
      session.id,
      iat,
      user.role,
    );

    await this._setSessionCacheMetadata(session.id, user, iat);

    this.logger.log(
      `User ${user.email} signed in from ${ipAddress} on ${deviceName}`,
      'Auth Service',
      { userId: user.id },
    );

    return {
      token: {
        access_token: accessToken,
        access_token_expiry: parseExpirationToSeconds(
          this.constantsConfig.ACCESS_TOKEN_EXPIRATION,
        ),
        refresh_token: refreshToken,
        refresh_token_expiry: parseExpirationToSeconds(
          this.constantsConfig.REFRESH_TOKEN_EXPIRATION,
        ),
      },
      user: {
        user_id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  }

  async signInWithGoogleService({
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

    const [user, device] = await this.prisma.$transaction(async (tx) => {
      const userData = await tx.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (!userData) {
        this.logger.log(
          `Google Sign in Attempt with non existing email:${payload.email}`,
        );
        throw new BadRequestException(
          'An account with this email does not exist',
        );
      }

      if (userData.auth_method !== AuthenticationMethod.google) {
        this.logger.log(
          `Attempt to login with with wrong auth method`,
          AuthSignInService.name,
        );
        throw new BadRequestException(
          `Email not registered with google,sign up with ${userData.auth_method}`,
        );
      }

      let userDevice: Device | null = null;

      userDevice = await tx.device.findFirst({
        where: {
          finger_print: deviceData.fingerPrint,
        },
      });

      if (!userDevice) {
        userDevice = await tx.device.create({
          data: {
            user_id: userData.id,
            device_name: deviceData.name,
            finger_print: deviceData.fingerPrint,
            type: deviceData.type,
            brand: deviceData.brand,
          },
        });
      }

      return [userData, userDevice];
    });

    return this._SignIn({
      user,
      ipAddress,
      deviceId: device.id,
      deviceName: device.device_name,
    });
  }

  async _createAccessToken(
    userId: string,
    sessionId: string,
    iat: number,
    userRole: UserRole,
  ): Promise<string> {
    const payload: AccessTokenPayloadMetaData = {
      user_id: userId,
      session_id: sessionId,
      type: 'access',
      role: userRole,
      iat,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.constantsConfig.ACCESS_TOKEN_EXPIRATION,
    });
  }

  async _createRefreshToken(userId: string, role: UserRole): Promise<string> {
    const refreshTokenPayload: RefreshTokenPayloadMetaData = {
      user_id: userId,
      role,
      type: 'refresh',
    };

    return this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: this.constantsConfig.REFRESH_TOKEN_EXPIRATION,
    });
  }

  async _setSessionCacheMetadata(sessionId: string, user: User, iat: number) {
    const expiryInSeconds = parseExpirationToSeconds(
      this.constantsConfig.ACCESS_TOKEN_EXPIRATION,
    );

    const cacheExpiry = convertSecondsToMilliseconds(expiryInSeconds);

    const metadata: CacheTokenMetaData = {
      user: this.extractUserMeta(user),
      iat,
    };

    await this.cacheManager.set(`session:${sessionId}`, metadata, cacheExpiry);
  }

  private async createSession({
    user,
    deviceId,
    ipAddress,
    refreshToken,
  }: {
    user: User;
    deviceId: string;
    ipAddress: string;
    refreshToken: string;
  }) {
    const expiry = captureFirstDigit(
      this.constantsConfig.REFRESH_TOKEN_EXPIRATION,
    );

    const expires_at = calculateDate({
      type: 'add',
      time: expiry,
      rangeType: 'day',
    });

    let deletedSessionIds: string[] = [];

    const newSession = await this.prisma.$transaction(async (tx) => {
      const staleSessions = await tx.session.findMany({
        where: {
          user_id: user.id,
          device_id: deviceId,
        },
        select: {
          id: true,
        },
      });

      deletedSessionIds = staleSessions.map((session) => session.id);

      await tx.session.deleteMany({
        where: {
          user_id: user.id,
          device_id: deviceId,
        },
      });

      return await tx.session.create({
        data: {
          user_id: user.id,
          device_id: deviceId,
          expires_at,
          refresh_token: refreshToken,
          ip_address: ipAddress,
        },
      });
    });

    const deletionPromises = deletedSessionIds.map((key) =>
      this.cacheManager.del(`session:${key}`),
    );
    await Promise.all(deletionPromises);

    return newSession;
  }

  private extractUserMeta(user: User): UserMetaData {
    return {
      user_id: user.id,
      email: user.email,
    };
  }
}
