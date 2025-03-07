import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  @Field()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must need to be one string' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;
}

@InputType()
export class ActivationDto {
  constructor(activationToken: string, activationCode: string) {
    this.activationToken = activationToken;
    this.activationCode = activationCode;
  }

  @Field()
  @IsNotEmpty({ message: 'Activation Token is required.' })
  activationToken: string;

  @Field()
  @IsNotEmpty({ message: 'Activation Code is required.' })
  activationCode: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}

@InputType()
export class ForgotPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;
}

@InputType()
export class ResetPasswordDto {
  constructor(password: string, activationToken: string) {
    this.password = password;
    this.activationToken = activationToken;
  }

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Activation Token is required.' })
  activationToken: string;
}
