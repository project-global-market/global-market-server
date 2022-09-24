import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Injectable, ForbiddenException } from '@nestjs/common'
import * as argon2 from 'argon2'

import { SignUpDto } from './dto'
import { I_SignUp, T_Tokens } from './models'

import { PrismaService } from 'modules/prisma/prisma.service'
import { UsersService } from 'modules/users/users.service'
import { E_AuthType } from 'models/app'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private config: ConfigService,
  ) {}

  async signUp(dto: SignUpDto): Promise<I_SignUp> {
    const userExists = await this.usersService.findUserByEmail(dto.email)
    if (userExists)
      throw new ForbiddenException('User with this email already exists')

    const hashedPassword = await argon2.hash(dto.password)

    const user = await this.usersService.createUser({
      email: dto.email,
      username: dto.username,
      hash: hashedPassword,
      from: E_AuthType.email,
    })

    const tokens = await this.getTokens(user.id, user.email)

    return {
      token: tokens.accessToken,
      id: user.id,
      email: user.email,
      username: user.username,
      message: 'Account has been created successfully...',
    }
  }

  async getTokens(userId: number, email: string): Promise<T_Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('ACCESS_TOKEN'),
          expiresIn: 60 * 60 * 24 * 2,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('REFRESH_TOKEN'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }
}
