import { Module } from '@nestjs/common'

import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

import { UsersService } from 'modules/users/users.service'
import { SubCategoriesService } from 'modules/sub-categories/sub-categories.service'

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, SubCategoriesService, UsersService],
})
export class CategoriesModule {}
