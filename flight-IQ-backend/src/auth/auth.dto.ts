import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';

import { Match } from 'src/common/decorator/dto.decorator';

export class EmailRegistrationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class CompleteRegistrationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  last_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(10)
  registration_token: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Validate(Match, ['password'], {
    message: 'Confirm password does not match password',
  })
  confirm_password: string;
}

export class ResendVerificationMailDto {
  @IsNotEmpty()
  @IsString()
  registration_token: string;
}

export class EmailVerificationDto {
  @IsNotEmpty()
  @IsString()
  @Length(10)
  registration_token: string;

  @IsNotEmpty()
  @IsString()
  verification_code: string;
}

export class GoogleOAuthTokenDto {
  @IsNotEmpty()
  @IsString()
  google_token: string;
}

export class CredentialsSignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
  })
  password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ConfirmResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  reset_token: string;

  @IsString()
  @Length(6, 6)
  verification_code: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  reset_token: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
  })
  password: string;
}
