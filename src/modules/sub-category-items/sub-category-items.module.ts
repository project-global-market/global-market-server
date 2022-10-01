import { Module } from '@nestjs/common'

import { SubCategoriesItemsService } from './sub-category-items'

@Module({
  providers: [SubCategoriesItemsService],
  exports: [SubCategoriesItemsService],
})
export class ItemsModule {}
