import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { CurrentUser, RoleOnly } from 'src/auth/auth.decorator';
import { UserRole } from 'prisma/generated/prisma/enums';
import { UserMetaData } from 'src/auth/auth.types';
import { RefreshTokenDto } from 'src/user/user.dto';
import { UserAccountServices } from 'src/user/services/user.account.services';

@Controller('user')
@RoleOnly(UserRole.user)
export class UserController {
  constructor(private readonly userAccountServices: UserAccountServices) {}

  @Get('/info')
  getProfileInfo(@CurrentUser() currentUser: UserMetaData) {
    return {
      user: currentUser,
    };
  }

  @Post('refresh-token')
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @CurrentUser() currentUser: UserMetaData,
  ) {
    return this.userAccountServices.refreshTokenService({
      refreshTokenDto,
      currentUser,
    });
  }

  @Post('logout')
  logOut(@CurrentUser() currentUser: UserMetaData, @Req() req: Request) {
    return this.userAccountServices.logOutService({ currentUser, req });
  }
}
