import { Module } from '@nestjs/common'

import { SubCategoriesItemsService } from './sub-category-items.service'

@Module({
  providers: [SubCategoriesItemsService],
  exports: [SubCategoriesItemsService],
})
export class ItemsModule {}
