import { Module } from '@nestjs/common'

import { SupportChatTicketsGateway } from './support-chat-tickets.gateway'
import { SupportChatTicketsService } from './support-chat-tickets.service'

@Module({
  providers: [SupportChatTicketsService, SupportChatTicketsGateway],
  exports: [SupportChatTicketsService],
})
export class SupportChatRoomsModule {}
