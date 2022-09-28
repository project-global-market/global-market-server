import { Module } from '@nestjs/common'

import { SubCategoriesController } from './sub-categories.controller'
import { SubCategoriesService } from './sub-categories.service'

@Module({
  controllers: [],
  providers: [SubCategoriesService, SubCategoriesController],
})
export class SubCategoriesModule {}
