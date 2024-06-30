import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';

import { ActivationDto, RegisterDto } from './dto/user.dto';
import { AuthGuard } from './guards/auth.guard';
import {
  ActivationResponse,
  LoginResponse,
  RegisterResponse,
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
}
