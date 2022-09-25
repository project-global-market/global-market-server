import { User } from '@prisma/client'
import { Injectable, ForbiddenException } from '@nestjs/common'
import * as argon2 from 'argon2'

import { CreateUserDto, UpdateUserDto } from './dto'
import { I_CreateUser } from './models'
import { I_User, T_UpdatePassword, T_UserDelete } from './models/users.model'

import { PrismaService } from 'modules/prisma/prisma.service'
import { E_AuthType } from 'models/app'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsersSecured(email: string): Promise<I_User[]> {
    const authorizedUser = await this.findUserByEmail(email)
    if (authorizedUser.role === 'User')
      throw new ForbiddenException('Permission denied')

    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        verified: true,
        email: true,
        updated_at: true,
        created_at: true,
        from: true,
      },
    })
  }

  async getUserSecured(id: string, email: string): Promise<I_User> {
    const authorizedUser = await this.findUserByEmail(email)
    if (authorizedUser.role === 'User')
      throw new ForbiddenException('Permission denied')

    const user = await this.prisma.user.findUnique({
      where: { id: +id },
      select: {
        id: true,
        username: true,
        role: true,
        verified: true,
        email: true,
        updated_at: true,
        created_at: true,
        from: true,
      },
    })

    return user
  }

  async updateUserSecure(
    id: string,
    dto: UpdateUserDto,
    email: string,
  ): Promise<I_User> {
    const authorizedUser = await this.findUserByEmail(email)
    if (authorizedUser.role === 'User')
      throw new ForbiddenException('Permission denied')

    return await this.prisma.user
      .update({
        where: { id: +id },
        data: dto,
        select: {
          id: true,
          username: true,
          role: true,
          verified: true,
          email: true,
          updated_at: true,
          created_at: true,
          from: true,
        },
      })
      .catch(() => {
        throw new ForbiddenException('Incorrect data sended')
      })
  }

  async createUserSecure(email: string, dto: CreateUserDto): Promise<I_User> {
    const authorizedUser = await this.findUserByEmail(email)
    if (authorizedUser.role === 'User' || authorizedUser.role === 'Moderator')
      throw new ForbiddenException('Permission denied')

    const userExists = await this.findUserByEmail(dto.email)
    if (userExists)
      throw new ForbiddenException('User with this email already exists')

    const hashedPassword = await argon2.hash(dto.password)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        hash: hashedPassword,
        from: E_AuthType.email,
        verified: false,
      },
      select: {
        id: true,
        username: true,
        role: true,
        verified: true,
        email: true,
        updated_at: true,
        created_at: true,
        from: true,
      },
    })

    return user
  }

  async deleteUserSecure(email: string, id: string): Promise<T_UserDelete> {
    const authorizedUser = await this.findUserByEmail(email)
    if (authorizedUser.role === 'User' || authorizedUser.role === 'Moderator')
      throw new ForbiddenException('Permission denied')

    const userExists = await this.findUserById(+id)
    if (!userExists)
      throw new ForbiddenException(`User with id ${id} not found`)

    const user = await this.prisma.user.delete({
      where: {
        id: +id,
      },
    })

    return {
      userId: user.id,
      message: 'User was deleted',
    }
  }

  async createUser({
    email,
    username,
    hash,
    from,
  }: I_CreateUser): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email,
        username,
        hash,
        from,
        verified: false,
      },
    })
  }

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async getTotalUsersCount(): Promise<number> {
    return await this.prisma.user.count()
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findUserById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id },
    })
  }

  async verifyUserEmail(email: string): Promise<User> {
    return await this.prisma.user.update({
      where: { email },
      data: { verified: true },
    })
  }

  async updateUserPassword({ email, hash }: T_UpdatePassword): Promise<User> {
    return await this.prisma.user.update({
      where: { email },
      data: { hash },
    })
  }

  async removeUserById(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}
