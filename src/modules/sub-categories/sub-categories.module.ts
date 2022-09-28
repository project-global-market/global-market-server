import { Module } from '@nestjs/common'

import { SubCategoriesController } from './sub-categories.controller'
import { SubCategoriesService } from './sub-categories.service'

@Module({
  providers: [SubCategoriesService],
  controllers: [SubCategoriesController],
})
export class SubCategoriesModule {}
