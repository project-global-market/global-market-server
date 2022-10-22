import { ForbiddenException, Injectable } from '@nestjs/common'

import { T_Order } from './models/orders.model'

import { PrismaService } from 'modules/prisma/prisma.service'
import { UsersService } from 'modules/users/users.service'

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  async getAllOrders(userId: number): Promise<T_Order[]> {
    const authorizedUser = await this.userService.findUserById(userId)
    if (authorizedUser.role === 'User')
      throw new ForbiddenException('Permission denied')

    return await this.prisma.order.findMany()
  }

  async getOrder(orderId: number, userId: number): Promise<T_Order> {
    const authorizedUser = await this.userService.findUserById(userId)
    if (authorizedUser.role === 'User')
      throw new ForbiddenException('Permission denied')

    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          select: {
            item: true,
            count: true,
            assignedAt: true,
          },
        },
      },
    })
    if (!order)
      throw new ForbiddenException(`Order with id ${orderId} do not exists`)

    return order
  }
}
