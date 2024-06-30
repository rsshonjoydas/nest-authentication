import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';

import { ActivationDto, RegisterDto } from './dto/user.dto';
import { EmailService } from './email/email.service';

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
}
