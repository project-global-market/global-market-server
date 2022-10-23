import { ForbiddenException, Injectable } from '@nestjs/common'

import { CreateOrderDto, UpdateOrderDto } from './dto'
import { T_Order } from './models'

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
            item: {
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
                image: true,
              },
            },
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

  async createOrder(dto: CreateOrderDto): Promise<T_Order> {
    return await this.prisma.order.create({
      data: {
        title: dto.title,
        comment: dto.comment,
        items: {
          create: dto.items.map((item) => ({
            item: {
              connect: {
                id: item.itemId,
              },
            },
            count: item.count,
          })),
        },
      },
    })
  }

  async updateOrder(
    orderId: number,
    userId: number,
    dto: UpdateOrderDto,
  ): Promise<T_Order> {
    const authorizedUser = await this.userService.findUserById(userId)
    if (authorizedUser.role === 'User')
      throw new ForbiddenException('Permission denied')

    const orderExists = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })
    if (!orderExists)
      throw new ForbiddenException(`Order with id ${orderId} not found`)

    return await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        title: dto.title,
        comment: dto.comment,
        items: {
          create: dto.items.map((item) => ({
            item: {
              connect: {
                id: item.itemId,
              },
            },
            count: item.count,
          })),
        },
      },
    })
  }

  async deleteOrder(orderId: number, userId: number): Promise<T_Order> {
    const authorizedUser = await this.userService.findUserById(userId)
    if (authorizedUser.role === 'User')
      throw new ForbiddenException('Permission denied')

    const orderExists = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })
    if (!orderExists)
      throw new ForbiddenException(`Order with id ${orderId} not found`)

    await this.prisma.order.update({
      data: {
        items: {
          deleteMany: {},
        },
      },
      where: {
        id: orderId,
      },
    })

    return await this.prisma.order.delete({
      where: {
        id: orderId,
      },
    })
  }
}
