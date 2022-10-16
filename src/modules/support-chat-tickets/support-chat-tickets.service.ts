import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

import { T_SocketId } from 'models/app'

import {
  E_TicketType,
  T_AuthorData,
  I_Ticket,
  T_TicketId,
  I_TicketMessage,
} from './models'

@Injectable()
export class SupportChatTicketsService {
  tickets: I_Ticket[] = []

  getAllTickets(): I_Ticket[] {
    return this.tickets
  }

  createTicket(
    socketId: T_SocketId,
    title: string,
    subTitle: string,
    author: T_AuthorData,
  ): I_Ticket {
    const ticketId = v4()

    const ticket: I_Ticket = {
      id: ticketId,
      title,
      subTitle,
      type: E_TicketType.opened,
      author: {
        id: author.id,
        socketId: author.socketId,
        email: author.email,
        username: author.username,
      },
      messages: [],
    }

    this.tickets.push(ticket)

    return ticket
  }

  createMessage(
    socketId: T_SocketId,
    ticketId: T_TicketId,
    text: string,
    author: T_AuthorData,
  ): I_TicketMessage {
    const ticket = this.findTicketById(ticketId)

    const messageId = v4()

    const message: I_TicketMessage = {
      id: messageId,
      author: {
        id: author.id,
        socketId: author.socketId,
        email: author.email,
        username: author.username,
      },
      text,
    }

    ticket.messages.push(message)

    return message
  }

  findTicketById(id: T_TicketId): I_Ticket {
    return this.tickets.find((ticket) => ticket.id === id)
  }
}
