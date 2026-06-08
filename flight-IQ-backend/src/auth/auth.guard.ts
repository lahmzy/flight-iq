/* eslint-disable  @typescript-eslint/no-unsafe-argument */
/* eslint-disable   @typescript-eslint/no-unsafe-assignment */
/* eslint-disable   @typescript-eslint/no-unsafe-member-access */

import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/infastructure/config/env/env';
import {
  AccessTokenPayloadMetaData,
  CacheTokenMetaData,
} from 'src/auth/auth.types';
import { UserRole } from 'prisma/generated/prisma/enums';
import { IS_PUBLIC_KEY, ROLES_KEY } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(CACHE_MANAGER)
  private cacheManager: Cache;

  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: AccessTokenPayloadMetaData =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('jwt_secret'),
        });

      const sessionData: CacheTokenMetaData | undefined =
        await this.cacheManager.get(`session:${payload.session_id}`);

      if (!sessionData) {
        throw new UnauthorizedException(
          'Session does not exist, Re-login to continue',
        );
      }

      if (sessionData.iat !== payload.iat) {
        throw new UnauthorizedException(
          'Token already expired, Re-log in to continue',
        );
      }

      if (roles && !roles.includes(payload.role)) {
        throw new ForbiddenException('Access denied for your role');
      }

      request['user'] = sessionData.user;
      request['meta'] = {
        iat: sessionData.iat,
        sessionId: payload.session_id,
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
