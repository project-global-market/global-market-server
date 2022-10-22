import { Injectable } from '@nestjs/common'
import { UsersService } from 'modules/users/users.service'

@Injectable()
export class InfoService {
  constructor(private usersService: UsersService) {}

  getMyInfo(id: number) {
    return this.usersService.findUserById(id)
  }
}
