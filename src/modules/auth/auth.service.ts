import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import * as argon2 from 'argon2'

import { SignInDto, SignUpDto } from './dto'
import { I_SignIn, I_SignUp, T_Tokens } from './models'

import { E_AuthType } from 'models/app'
import { UsersService } from 'modules/users/users.service'
import { PrismaService } from 'modules/prisma/prisma.service'

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
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      id: user.id,
      email: user.email,
      username: user.username,
      message: 'Successfully created',
    }
  }

  async signIn(dto: SignInDto): Promise<I_SignIn> {
    const user = await this.usersService.findUserByEmail(dto.email)
    if (!user) throw new ForbiddenException('User not found')

    if (user.from !== E_AuthType.email)
      throw new ForbiddenException('User registered through another service')

    const passwordMatches = await argon2.verify(user.hash, dto.password)

    if (!passwordMatches) throw new ForbiddenException('Wrong password')

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      id: user.id,
      email: user.email,
      username: user.username,
      message: 'Successfully authorized',
    }
  }

  async refreshToken(email: string, rt: string): Promise<T_Tokens> {
    try {
      const user = await this.usersService.findUserByEmail(email)

      if (!user) throw new ForbiddenException('Incorrect data')

      const refreshTokenMatches = await argon2.verify(user.hashedRt, rt)

      if (!refreshTokenMatches)
        throw new ForbiddenException('Incorrect refresh token')

      const tokens = await this.getTokens(user.id, user.email)
      await this.updateRefreshToken(user.id, tokens.refreshToken)

      return tokens
    } catch {
      throw new NotFoundException('Refresh token expired')
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

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hash = await argon2.hash(refreshToken)
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }
}
