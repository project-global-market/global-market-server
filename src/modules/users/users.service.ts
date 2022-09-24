import { User } from '@prisma/client'
import { Injectable } from '@nestjs/common'

import { I_CreateUser } from './models'

import { PrismaService } from 'modules/prisma/prisma.service'
import { T_UpdatePassword } from './models/users.model'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.user.findMany()
  }

  async getTotalUsersCount(): Promise<number> {
    return await this.prisma.user.count()
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email },
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
