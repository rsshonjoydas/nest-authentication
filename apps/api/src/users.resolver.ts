import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';

import {
  ActivationDto,
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import {
  ActivationResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from './types/user.types';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill the all fields.');
    }

    const { activationToken } = await this.userService.register(
      registerDto,
      context.res,
    );

    return { activationToken };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    const activate = await this.userService.activateUser(
      activationDto,
      context.res,
    );
    return activate;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    const loginUser = await this.userService.login({ email, password });
    return loginUser;
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: Request }) {
    const user = await this.userService.getLoggedInUser(context.req);
    return user;
  }

  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  async logOutUser(@Context() context: { req: Request }) {
    const logoutUser = await this.userService.logout(context.req);
    return logoutUser;
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    const forgot = await this.userService.forgotPassword(forgotPasswordDto);
    return forgot;
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    const reset = await this.userService.resetPassword(resetPasswordDto);
    return reset;
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
