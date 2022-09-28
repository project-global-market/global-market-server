import { Injectable, ForbiddenException } from '@nestjs/common'

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

  async findCategoryById(id: number): Promise<T_Category> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        description: true,
        isActive: true,
        subCategory: true,
      },
    })

    if (!category) throw new ForbiddenException('Category not found')

    return category
  }

  async createCategory(
    dto: CreateCategoryDto,
    id: number,
  ): Promise<T_Category> {
    const authorizedUser = await this.usersService.findUserById(id)

    if (authorizedUser.role === 'User' || authorizedUser.role === 'Moderator')
      throw new ForbiddenException('Permission denied')

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
    id: number,
  ): Promise<T_Category> {
    const authorizedUser = await this.usersService.findUserById(userId)

    if (authorizedUser.role === 'User' || authorizedUser.role === 'Moderator')
      throw new ForbiddenException('Permission denied')

    if (typeof dto.isActive !== 'boolean')
      throw new ForbiddenException('Active flag has to be boolean')

    const categoryExists = await this.prisma.category.findUnique({
      where: { id },
    })

    if (!categoryExists)
      throw new ForbiddenException(`Category not found with id ${id}`)

    return await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        title: dto.title,
        description: dto.description,
        isActive: dto.isActive,
      },
    })
  }

  async deleteCategory(userId: number, id: number): Promise<T_CategoryDelete> {
    const authorizedUser = await this.usersService.findUserById(userId)

    if (authorizedUser.role === 'User' || authorizedUser.role === 'Moderator')
      throw new ForbiddenException('Permission denied')

    const categoryExists = await this.prisma.category.findUnique({
      where: { id },
    })

    if (!categoryExists)
      throw new ForbiddenException(`Category not found with id ${id}`)

    await this.prisma.category.delete({
      where: {
        id,
      },
    })

    return {
      id,
      message: `Category with id ${id} was deleted`,
    }
  }
}
