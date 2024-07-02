/* eslint-disable class-methods-use-this */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';

import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';

interface UserData {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  private async checkIfUserExists(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException('Email already exists!');
    }
  }

  private static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async createActivationToken(user: UserData) {
    const activationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }

  /**
   * @description New user register
   * @function {@link register}
   * @param {RegisterDto} registerDto
   * @param {Response} response
   * @return {*} activationToken, response
   * @memberof UsersService
   */
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password } = registerDto;

    await this.checkIfUserExists(email);

    const hashedPassword = await UsersService.hashPassword(password);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    const generateActivationToken = await this.createActivationToken(user);

    const { activationCode } = generateActivationToken;

    const activationToken = generateActivationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activationToken, response };
  }

  /**
   * @description activate user for verification
   * @function {@link activateUser}
   * @param {ActivationDto} activationDto
   * @param {Response} response
   * @return {*} user, response
   * @memberof UsersService
   */
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password } = newUser.user;

    await this.checkIfUserExists(email);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return { user, response };
  }

  private static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const checkPassword = await bcrypt.compare(password, hashedPassword);
    return checkPassword;
  }

  /**
   * @description login exist user with email and password
   * @function {@link login}
   * @param {LoginDto} loginDto
   * @return {*}
   * @memberof UsersService
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await UsersService.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    }
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      error: {
        message: 'Invalid email or password',
      },
    };
  }

  /**
   * @description get logged in user protected by auth guard
   * @function {@link getLoggedInUser}
   * @param {*} req
   * @return {*}
   * @memberof UsersService
   */
  async getLoggedInUser(req: any) {
    const { user } = req;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    return { user, refreshToken, accessToken };
  }

  /**
   * @description user logout
   * @function {@link logout}
   * @param {*} req
   * @return {*}
   * @memberof UsersService
   */
  async logout(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;
    return { message: 'Logged out successfully!' };
  }

  private async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  /**
   * @description forgot password
   * @function {@link ForgotPassword}
   * @param {ForgotPasswordDto}
   * @return {*}
   * @memberof UsersService
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found with this email!');
    }

    const forgotPasswordToken = await this.generateForgotPasswordLink(user);

    const resetPasswordUrl = `${this.configService.get<string>(
      'CLIENT_SIDE_URI',
    )}/auth/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: 'Reset your Password!',
      template: './forgot-password',
      name: user.name,
      activationCode: resetPasswordUrl,
    });

    return { message: `Your forgot password request successful!` };
  }

  /**
   * @description reset password
   * @function {@link resetPassword}
   * @param {ResetPasswordDto}
   * @return {*}
   * @memberof UsersService
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;

    const decoded = await this.jwtService.decode(activationToken);

    if (!decoded || decoded.exp * 1000 < Date.now()) {
      throw new BadRequestException('Invalid token!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.update({
      where: {
        id: decoded.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { user };
  }

  /**
   * @description get all users
   * @function {@link getUsers}
   * @return {*}
   * @memberof UsersService
   */
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
