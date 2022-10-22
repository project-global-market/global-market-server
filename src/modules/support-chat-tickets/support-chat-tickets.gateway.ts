import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'

import { SupportChatTicketsService } from './support-chat-tickets.service'
import {
  I_CreateTicketEmitPayload,
  I_CreateTicketMessageEmitPayload,
} from './models'

import { E_SupportChatEmit, E_SupportChatSubscribe } from 'models/socket'

@WebSocketGateway(8000, { cors: '*' })
export class SupportChatTicketsGateway {
  @WebSocketServer()
  server: Server

  private logger: Logger = new Logger('SupportChatRoomsGateway')

  constructor(private supportChatTicketsService: SupportChatTicketsService) {}

  async init() {
    this.logger.log('Init SupportChatRoomsGateway')
  }

  connection(client: Socket) {
    this.logger.log(`Connected to SupportChatRoomsGateway id: ${client.id}`)
  }

  disconnect(client: Socket) {
    this.logger.log(`Disconnected id: ${client.id}`)
  }

  // Получение тикетов для админки
  @SubscribeMessage(E_SupportChatEmit.requestTickets)
  requestTickets(client: Socket) {
    const tickets = this.supportChatTicketsService.getAllTickets()

    client.emit(E_SupportChatSubscribe.getTickets, { tickets })
  }

  // Создание тикета
  @SubscribeMessage(E_SupportChatEmit.createTicket)
  createTicket(client: Socket, data: I_CreateTicketEmitPayload) {
    const { title, subTitle, author } = data

    // Создание тикета и добавляем туда юзера
    const ticket = this.supportChatTicketsService.createTicket(
      client.id,
      title,
      subTitle,
      author,
    )

    // Подключаем создателя тикета
    client.join(ticket.id)

    // Отправляем тикет всем кроме отправителя
    client.broadcast.emit(E_SupportChatSubscribe.getTicket, {
      ticket,
    })

    client.emit(E_SupportChatSubscribe.getTicket, {
      ticket,
      message: 'Ticket created',
    })
  }



  // Отправка сообщения в тикет руме
  @SubscribeMessage(E_SupportChatEmit.sendTicketMessage)
  sendTicketMessage(
    client: Socket,
    data: I_CreateTicketMessageEmitPayload,
  ): void {
    const { text, author } = data

    const { message, id } = this.supportChatTicketsService.createMessage(
      client.id,
      text,
      author,
    )

    this.server
      .to(id)
      .emit(E_SupportChatSubscribe.getTicketMessage, { message })
  }
}
