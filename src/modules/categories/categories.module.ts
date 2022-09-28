import { Module } from '@nestjs/common'

import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

@Module({
  controllers: [],
  providers: [CategoriesService, CategoriesController],
})
export class CategoriesModule {}
