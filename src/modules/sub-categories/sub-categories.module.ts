import { Module } from '@nestjs/common'

import { SubCategoriesService } from './sub-categories.service'
import { SubCategoriesController } from './sub-categories.controller'

import { UsersService } from 'modules/users/users.service'

@Module({
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService, UsersService],
  exports: [SubCategoriesService],
})
export class SubCategoriesModule {}
