import { Injectable, ForbiddenException } from '@nestjs/common'

import { T_SubCategory, T_SubCategoryDelete } from './models'

import { PrismaService } from 'modules/prisma/prisma.service'
import { UsersService } from 'modules/users/users.service'
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto'

@Injectable()
export class SubCategoriesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async getAllSubCategories(categoryId: number): Promise<T_SubCategory[]> {
    const subCategories = await this.prisma.subCategory.findMany({
      where: {
        categoryId: categoryId,
      },
    })

    if (!subCategories.length)
      throw new ForbiddenException(
        `Sub-categories in category with id ${categoryId} do not exists`,
      )

    return subCategories
  }

  async getSubCategory(
    categoryId: number,
    subCategoryId: number,
  ): Promise<T_SubCategory> {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!categoryExists)
      throw new ForbiddenException(
        `Category with id ${categoryId} do not exists`,
      )

    const subCategoryMapped = await this.prisma.subCategory.findMany({
      where: {
        categoryId,
        id: subCategoryId,
      },
    })

    const subCategory = subCategoryMapped.find(
      (item) => item.id === subCategoryId,
    )

    if (!subCategory)
      throw new ForbiddenException(
        `Sub-category with id ${subCategoryId} do not exists`,
      )

    return subCategory
  }

  async createSubCategory(
    categoryId: number,
    dto: CreateSubCategoryDto,
  ): Promise<T_SubCategory> {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!categoryExists)
      throw new ForbiddenException(
        `Category with id ${categoryId} do not exists`,
      )

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
    userId: number,
  ): Promise<T_SubCategory> {
    const authorizedUser = await this.usersService.findUserById(userId)

    if (authorizedUser.role === 'User' || authorizedUser.role === 'Moderator')
      throw new ForbiddenException('Permission denied')

    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!categoryExists)
      throw new ForbiddenException(
        `Category with id ${categoryId} do not exists`,
      )

    const subCategoryExists = await this.prisma.subCategory.findUnique({
      where: {
        id: subCategoryId,
      },
    })

    if (!subCategoryExists)
      throw new ForbiddenException(
        `Sub-category with id ${subCategoryId} do not exists`,
      )

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
    userId: number,
  ): Promise<T_SubCategoryDelete> {
    const authorizedUser = await this.usersService.findUserById(userId)

    if (authorizedUser.role === 'User' || authorizedUser.role === 'Moderator')
      throw new ForbiddenException('Permission denied')

    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!categoryExists)
      throw new ForbiddenException(
        `Category with id ${categoryId} do not exists`,
      )

    const subCategoryExists = await this.prisma.subCategory.findUnique({
      where: {
        id: subCategoryId,
      },
    })

    if (!subCategoryExists)
      throw new ForbiddenException(
        `Sub-category with id ${subCategoryId} do not exists`,
      )

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
