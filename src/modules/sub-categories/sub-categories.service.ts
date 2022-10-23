import { ForbiddenException, Injectable } from '@nestjs/common'

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
    await this.checkCategoryExists(categoryId)

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
    userId: number,
    dto: CreateSubCategoryDto,
  ): Promise<T_SubCategory> {
    await this.checkAuthorizedUser(userId)
    await this.checkCategoryExists(categoryId)

    return await this.prisma.subCategory.create({
      data: {
        title: dto.title,
        description: dto.description,
        categoryId,
      },
    })
  }

  async updateSubCategory(
    categoryId: number,
    subCategoryId: number,
    dto: UpdateSubCategoryDto,
    userId: number,
  ): Promise<T_SubCategory> {
    await this.checkAuthorizedUser(userId)
    await this.checkCategoryExists(categoryId)
    await this.checkSubCategoryExists(categoryId, subCategoryId)

    return await this.prisma.subCategory.update({
      where: {
        id: subCategoryId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: categoryId,
      },
    })
  }

  async deleteSubCategory(
    categoryId: number,
    subCategoryId: number,
    userId: number,
  ): Promise<T_SubCategoryDelete> {
    await this.checkAuthorizedUser(userId)
    await this.checkCategoryExists(categoryId)
    await this.checkSubCategoryExists(categoryId, subCategoryId)

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

  async checkAuthorizedUser(userId: number) {
    const authorizedUser = await this.usersService.findUserById(userId)

    if (authorizedUser.role === 'User' || authorizedUser.role === 'Moderator')
      throw new ForbiddenException('Permission denied')
  }

  async checkCategoryExists(categoryId: number) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })
    if (!categoryExists)
      throw new ForbiddenException(
        `Category with id ${categoryId} do not exists`,
      )
  }

  async checkSubCategoryExists(categoryId: number, subCategoryId: number) {
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
  }
}
