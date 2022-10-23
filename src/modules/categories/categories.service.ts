import { ForbiddenException, Injectable } from '@nestjs/common'

import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { T_Category } from './models'

import { PrismaService } from 'modules/prisma/prisma.service'
import { UsersService } from 'modules/users/users.service'
import { T_CategoryDelete } from './models/categories.model'

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async getAllCategories(): Promise<T_Category[]> {
    const categories = await this.prisma.category.findMany()

    if (!categories) throw new ForbiddenException('Categories not found')

    return categories
  }

  async findCategoryById(categoryId: number): Promise<T_Category> {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })
    if (!category)
      throw new ForbiddenException(
        `Category with id ${categoryId} do not exists`,
      )

    return category
  }

  async createCategory(
    dto: CreateCategoryDto,
    userId: number,
  ): Promise<T_Category> {
    await this.checkAuthorizedUser(userId)

    return await this.prisma.category.create({
      data: {
        title: dto.title,
        description: dto.description,
        isActive: dto.isActive,
      },
    })
  }

  async updateCategory(
    dto: UpdateCategoryDto,
    userId: number,
    categoryId: number,
  ): Promise<T_Category> {
    await this.checkAuthorizedUser(userId)
    await this.checkCategoryExists(categoryId)

    if (typeof dto.isActive !== 'boolean')
      throw new ForbiddenException('Active flag has to be boolean')

    return await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        isActive: dto.isActive,
      },
    })
  }

  async deleteCategory(
    userId: number,
    categoryId: number,
  ): Promise<T_CategoryDelete> {
    await this.checkAuthorizedUser(userId)
    await this.checkCategoryExists(categoryId)

    await this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    })

    return {
      categoryId,
      message: `Category with id ${categoryId} was deleted`,
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
}
