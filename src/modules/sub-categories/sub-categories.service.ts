import { Injectable, ForbiddenException } from '@nestjs/common'

import { T_SubCategory, T_SubCategoryDelete } from './models'

import { PrismaService } from 'modules/prisma/prisma.service'
import { UsersService } from 'modules/users/users.service'
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto'

@Injectable()
export class SubCategoriesService {
  constructor(private prisma: PrismaService, usersService: UsersService) {}

  async getAllSubCategories(categoryId: number): Promise<T_SubCategory[]> {
    const categories = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        subCategory: true,
      },
    })

    if (!categories || !categories.subCategory)
      throw new ForbiddenException('Sub-categories not found')

    return categories.subCategory
  }

  async getSubCategory(
    categoryId: number,
    subCategoryId: number,
  ): Promise<T_SubCategory> {
    const categories = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        subCategory: true,
      },
    })

    const subCategory = categories.subCategory.find((item) => {
      return item.id === subCategoryId
    })

    return subCategory
  }

  async createSubCategory(
    categoryId: number,
    dto: CreateSubCategoryDto,
  ): Promise<T_SubCategory> {
    const subCategory = await this.prisma.subCategory.create({
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: categoryId,
      },
    })

    return subCategory
  }

  async updateSubCategory(
    categoryId: number,
    subCategoryId: number,
    dto: UpdateSubCategoryDto,
  ): Promise<T_SubCategory> {
    const subCategory = await this.prisma.subCategory.update({
      where: {
        id: subCategoryId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: categoryId,
      },
    })

    return subCategory
  }

  async deleteSubCategory(
    categoryId: number,
    subCategoryId: number,
  ): Promise<T_SubCategoryDelete> {
    await this.prisma.subCategory.deleteMany({
      where: {
        categoryId,
        id: subCategoryId,
      },
    })

    return {
      id: subCategoryId,
      message: `Sub-category with id ${subCategoryId} was deleted`,
    }
  }
}
