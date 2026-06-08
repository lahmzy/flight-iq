import { UserRole } from 'prisma/generated/prisma/enums';

export type RedirectAction = 'is_mail_verified' | 'is_account_completed';

export type RedirectActionType = Record<RedirectAction, string>;

export type TokenType = 'access' | 'refresh';

export type RefreshTokenPayloadMetaData = {
  user_id: string;
  role: UserRole;
  type: TokenType;
};

export type AccessTokenPayloadMetaData = {
  user_id: string;
  session_id: string;
  role: UserRole;
  type: TokenType;
  iat: number;
};

export type CacheTokenMetaData = {
  user: UserMetaData;
  iat: number;
};

export type UserMetaData = {
  user_id: string;
  email: string;
};

export type ForgotPasswordTokenData = {
  userId: string;
  isVerified: boolean;
};
