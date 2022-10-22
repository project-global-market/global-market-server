import {ForbiddenException, Injectable} from '@nestjs/common'

import {CreateSubCategoryItemDto, UpdateSubCategoryItemDto} from './dto'
import {T_SubCategoryItem, T_SubCategoryItemDelete} from './models'

import {PrismaService} from 'modules/prisma/prisma.service'

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

    return await this.prisma.item.findMany({
      where: {
        categoryId,
        subCategoryId,
      },
    })
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

  async createSubCategoryItem(
    categoryId: number,
    subCategoryId: number,
    dto: CreateSubCategoryItemDto,
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

    return await this.prisma.item.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        image: dto.image,
        categoryId,
        subCategoryId,
      },
    })
  }

  async updateSubCategoryItem(
    categoryId: number,
    subCategoryId: number,
    subCategoryItemId: number,
    dto: UpdateSubCategoryItemDto,
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

    const subCategoryItemExists = await this.prisma.item.findUnique({
      where: {
        id: subCategoryItemId,
      },
    })

    if (!subCategoryItemExists)
      throw new ForbiddenException(
        `Item with id ${subCategoryItemId} do not exists`,
      )

    const subCategoryItem = await this.prisma.item.update({
      where: {
        id: subCategoryItemId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        image: dto.image,
        categoryId,
        subCategoryId,
      },
    })

    return subCategoryItem
  }

  async deleteSubCategoryItem(
    categoryId: number,
    subCategoryId: number,
    subCategoryItemId: number,
  ): Promise<T_SubCategoryItemDelete> {
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

    const subCategoryItemExists = await this.prisma.item.findUnique({
      where: {
        id: subCategoryItemId,
      },
    })

    if (!subCategoryItemExists)
      throw new ForbiddenException(
        `Item with id ${subCategoryItemId} do not exists`,
      )

    await this.prisma.item.deleteMany({
      where: {
        categoryId,
        subCategoryId,
        id: subCategoryItemId,
      },
    })

    return {
      id: subCategoryItemId,
      message: `Item with id ${subCategoryItemId} was deleted`,
    }
  }
}
