import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

import { T_SocketId } from 'models/app'

import {
  E_TicketType,
  I_Ticket,
  I_TicketMessage,
  T_AuthorData,
  T_TicketId,
} from './models'

@Injectable()
export class TicketsService {
  tickets: I_Ticket[] = [
    {
      id: '1',
      author: {
        id: 1,
        email: 'test',
        socketId: '123',
        username: '123456',
      },
      title: 'test',
      subTitle: 'test subt',
      type: E_TicketType.opened,
      messages: [],
    },
  ]

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
        socketId,
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
    text: string,
    author: T_AuthorData,
  ): { message: I_TicketMessage; id: string } {
    const ticket = this.findTicketBySocketId(socketId)

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

    return { message, id: ticket.id }
  }

  findTicketById(id: T_TicketId): I_Ticket {
    return this.tickets.find((ticket) => ticket.id === id)
  }

  findTicketBySocketId(socketId: T_SocketId) {
    return this.tickets.find((ticket) => ticket.author.socketId === socketId)
  }
}
