import { Module } from '@nestjs/common'

import { SubCategoriesService } from './sub-categories.service'

import { UsersService } from 'modules/users/users.service'

@Module({
  providers: [SubCategoriesService, UsersService],
})
export class SubCategoriesModule {}
