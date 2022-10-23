import { Module } from '@nestjs/common'

import { TicketsGateway } from './tickets.gateway'
import { TicketsService } from './tickets.service'

@Module({
  providers: [TicketsService, TicketsGateway],
  exports: [TicketsService],
})
export class TicketsModule {}
