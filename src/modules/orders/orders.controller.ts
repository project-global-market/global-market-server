import { Controller, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common/decorators'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

import { CreateOrderDto, UpdateOrderDto } from './dto'
import { T_Order } from './models'
import { OrdersService } from './orders.service'

@Controller('api/orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
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

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order created',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createOrder(@Body() dto: CreateOrderDto): Promise<T_Order> {
    return this.ordersService.createOrder(dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':orderId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order updated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updateOrder(
    @Param('orderId') orderId: string,
    @Req() req: Request,
    @Body() dto: UpdateOrderDto,
  ): Promise<T_Order> {
    const user = req.user
    return this.ordersService.updateOrder(
      Number(orderId),
      Number(user['sub']),
      dto,
    )
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':orderId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order deleted',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deleteOrder(
    @Param('orderId') orderId: string,
    @Req() req: Request,
  ): Promise<T_Order> {
    const user = req.user
    return this.ordersService.deleteOrder(Number(orderId), Number(user['sub']))
  }
}
