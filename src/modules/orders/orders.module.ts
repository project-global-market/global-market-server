import { Module } from '@nestjs/common'

import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'

import { UsersService } from 'modules/users/users.service'

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, UsersService],
  exports: [OrdersService],
})
export class OrdersModule {}
