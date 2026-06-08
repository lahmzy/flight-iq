import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthSignInService } from 'src/auth/service/auth.sigin.service';
import { UserAccountServices } from './services/user.account.services';

@Module({
  controllers: [UserController],
  providers: [UserAccountServices, AuthSignInService],
})
export class UserModule {}
