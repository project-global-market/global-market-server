import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { HttpCode, Req, UseGuards } from '@nestjs/common/decorators'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

import { OrdersService } from './orders.service'
import { T_Order } from './models/orders.model'

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getAllOrders(@Req() req: Request): Promise<T_Order[]> {
    const user = req.user
    return this.ordersService.getAllOrders(Number(user['sub']))
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':orderId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getOrder(
    @Param('orderId') orderId: string,
    @Req() req: Request,
  ): Promise<T_Order> {
    const user = req.user
    return this.ordersService.getOrder(Number(orderId), Number(user['sub']))
  }
}
