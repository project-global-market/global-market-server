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
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!categoryExists)
      throw new ForbiddenException(
        `Category with id ${categoryId} do not exists`,
      )

    const subCategoryExists = await this.prisma.subCategory.findMany({
      where: {
        categoryId,
        id: subCategoryId,
      },
    })

    if (!subCategoryExists.length)
      throw new ForbiddenException(
        `Sub-category with id ${subCategoryId} do not exists`,
      )

    const subCategoryItems = await this.prisma.item.findMany({
      where: {
        categoryId,
        subCategoryId,
      },
    })

    return subCategoryItems
  }

  async getSubCategoryItem(
    categoryId: number,
    subCategoryId: number,
    subCategoryItemId: number,
  ): Promise<T_SubCategoryItem> {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!categoryExists)
      throw new ForbiddenException(
        `Category with id ${categoryId} do not exists`,
      )

    const subCategoryExists = await this.prisma.subCategory.findMany({
      where: {
        categoryId,
        id: subCategoryId,
      },
    })

    if (!subCategoryExists.length)
      throw new ForbiddenException(
        `Sub-category with id ${subCategoryId} do not exists`,
      )

    const subCategoryItemMapped = await this.prisma.item.findMany({
      where: {
        categoryId,
        subCategoryId,
        id: subCategoryItemId,
      },
    })

    const subCategoryItem = subCategoryItemMapped.find(
      (item) => item.id === subCategoryItemId,
    )

    if (!subCategoryItem)
      throw new ForbiddenException(
        `Item with id ${subCategoryItemId} do not exists`,
      )

    return subCategoryItem
  }
}
