import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../entities/user.entity';

@ObjectType()
export class ErrorType {
  constructor(message: string, code?: string) {
    this.message = message;
    this.code = code;
  }

  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class RegisterResponse {
  constructor(activationToken: string) {
    this.activationToken = activationToken;
  }

  @Field()
  activationToken: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ActivationResponse {
  @Field(() => User)
  user: User | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User | any;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
