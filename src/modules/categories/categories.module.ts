import { Module } from '@nestjs/common'

import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

import { UsersService } from 'modules/users/users.service'

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, UsersService],
})
export class CategoriesModule {}
