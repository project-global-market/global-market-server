import { Module } from '@nestjs/common'
import { UsersService } from 'modules/users/users.service'

import { InfoController } from './info.controller'
import { InfoService } from './info.service'

@Module({
  controllers: [InfoController],
  providers: [InfoService, UsersService],
  exports: [InfoService],
})
export class InfoModule {}
