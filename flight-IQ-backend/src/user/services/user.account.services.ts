import {
  Injectable,
  UnauthorizedException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import {
  AccessTokenPayloadMetaData,
  UserMetaData,
  CacheTokenMetaData,
} from 'src/auth/auth.types';
import { AppLogger } from 'src/infastructure/logger/app.logger';
import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';
import { AppConfig } from 'src/infastructure/config/env/env';
import { RefreshTokenDto } from 'src/user/user.dto';
import { AuthSignInService } from 'src/auth/service/auth.sigin.service';
import { parseExpirationToSeconds } from 'src/utility/time.utility';
import {
  AppConstants,
  CONSTANTS_TOKEN,
} from 'src/infastructure/config/constants/constants.config';

@Injectable()
export class UserAccountServices {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    @Inject(CONSTANTS_TOKEN)
    private readonly constantsConfig: AppConstants,

    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly signInService: AuthSignInService,
  ) {}

  async refreshTokenService({
    currentUser,
    refreshTokenDto,
  }: {
    currentUser: UserMetaData;
    refreshTokenDto: RefreshTokenDto;
  }) {
    await this.verifyTokenValidity({
      token: refreshTokenDto.refresh_token,
      userId: currentUser.user_id,
    });

    const refreshToken = await this.signInService._createRefreshToken(
      currentUser.user_id,
      'user',
    );

    const session = await this.prisma.$transaction(async (tx) => {
      const activeSession = await tx.session.findFirst({
        where: {
          user_id: currentUser.user_id,
          refresh_token: refreshTokenDto.refresh_token,
        },
      });

      if (!activeSession) {
        throw new BadRequestException('Token Invalid or expired');
      }

      const now = new Date();

      const updatedSession = await this.prisma.session.update({
        where: {
          id: activeSession.id,
          expires_at: {
            gte: now,
          },
        },
        data: {
          refresh_token: refreshToken,
        },
        include: {
          User: true,
        },
      });

      return updatedSession;
    });
    const iat = Math.floor(Date.now() / 1000);

    const accessToken = await this.signInService._createAccessToken(
      currentUser.user_id,
      session.id,
      iat,
      'user',
    );

    await this.signInService._setSessionCacheMetadata(
      session.id,
      session.User,
      iat,
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
    };
  }

  private async verifyTokenValidity({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }) {
    try {
      const payload: AccessTokenPayloadMetaData =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('jwt_secret'),
        });

      if (payload.user_id !== userId) {
        throw new BadRequestException();
      }
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      throw new BadRequestException('Invalid token passed');
    }
  }

  async logOutService({
    currentUser,
    req,
  }: {
    currentUser: UserMetaData;
    req: Request;
  }) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('Authentication token not provided.');
    }

    let payload: AccessTokenPayloadMetaData;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt_secret'),
      });
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const sessionKey = `session:${payload.session_id}`;
    const sessionData: CacheTokenMetaData | undefined =
      await this.cacheManager.get(sessionKey);

    if (!sessionData) {
      throw new BadRequestException(
        'Session already expired, Kindly relogin to continue',
      );
    }

    await this.cacheManager.del(sessionKey);
    await this.prisma.session.delete({
      where: {
        id: payload.session_id,
      },
    });

    this.logger.log(`User ${currentUser.email} logged out.`, 'User Service', {
      userId: sessionData.user.user_id,
    });

    return {};
  }

  async logOutAllDevicesServices(userId: string) {
    const userSessions = await this.prisma.session.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
      },
    });

    const cacheDeletionPromises = userSessions.map((session) => {
      const sessionKey = `session:${session.id}`;
      return this.cacheManager.del(sessionKey);
    });

    await Promise.all(cacheDeletionPromises);

    await this.prisma.session.deleteMany({
      where: {
        user_id: userId,
      },
    });

    return {};
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
