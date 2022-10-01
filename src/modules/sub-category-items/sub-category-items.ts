import { Injectable, ForbiddenException } from '@nestjs/common'
import { PrismaService } from 'modules/prisma/prisma.service'

import { T_SubCategoryItem } from './models'

@Injectable()
export class SubCategoriesItemsService {
  constructor(private prisma: PrismaService) {}

  async getAllSubCategoryItems(
    categoryId: number,
    subCategoryId: number,
  ): Promise<T_SubCategoryItem[]> {
    const subCategoryItems = await this.prisma.item.findMany({
      where: {
        categoryId,
        subCategoryId,
      },
    })

    return subCategoryItems
  }
}
