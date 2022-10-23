import { Module } from '@nestjs/common'

import { SubCategoriesItemsService } from './sub-category-items.service'
import { SubCategoryItemsController } from './sub-category-items.controller'

import { UsersService } from 'modules/users/users.service'

@Module({
  controllers: [SubCategoryItemsController],
  providers: [SubCategoriesItemsService, UsersService],
  exports: [SubCategoriesItemsService],
})
export class ItemsModule {}
