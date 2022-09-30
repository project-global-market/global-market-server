import {
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common/decorators'
import { Controller, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

import { CategoriesService } from './categories.service'
import { T_Category } from './models'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { T_CategoryDelete } from './models/categories.model'

import {
  T_SubCategory,
  T_SubCategoryDelete,
} from 'modules/sub-categories/models'
import { SubCategoriesService } from 'modules/sub-categories/sub-categories.service'
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from 'modules/sub-categories/dto'

@Controller('category')
@ApiTags('Category')
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getAllCategories(): Promise<T_Category[]> {
    return this.categoriesService.getAllCategories()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getCategory(@Param('id') id: string): Promise<T_Category> {
    return this.categoriesService.findCategoryById(Number(id))
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createCategory(
    @Req() req: Request,
    @Body() dto: CreateCategoryDto,
  ): Promise<T_Category> {
    const user = req.user
    return this.categoriesService.createCategory(dto, Number(user['sub']))
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updateCategory(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateCategoryDto,
  ): Promise<T_Category> {
    const user = req.user
    return this.categoriesService.updateCategory(
      dto,
      Number(user['sub']),
      Number(id),
    )
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category deleted',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deleteCategory(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<T_CategoryDelete> {
    const user = req.user
    return this.categoriesService.deleteCategory(
      Number(user['sub']),
      Number(id),
    )
  }

  @Get(':id/sub-categories')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SubCategories fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getAllSubCategories(
    @Param('id') categoryId: string,
  ): Promise<T_SubCategory[]> {
    return this.subCategoriesService.getAllSubCategories(Number(categoryId))
  }

  @Get(':id/sub-category/:subCategoryId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SubCategory fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getSubCategory(
    @Param('id') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<T_SubCategory> {
    return this.subCategoriesService.getSubCategory(
      Number(categoryId),
      Number(subCategoryId),
    )
  }

  @Post(':id/sub-category')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'SubCategory created',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createSubCategory(
    @Param('id') categoryId: string,
    @Body() dto: CreateSubCategoryDto,
  ): Promise<T_SubCategory> {
    return this.subCategoriesService.createSubCategory(Number(categoryId), dto)
  }

  @Put(':id/sub-category/:subCategoryId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SubCategory created',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updateSubCategory(
    @Param('id') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Body() dto: UpdateSubCategoryDto,
  ): Promise<T_SubCategory> {
    return this.subCategoriesService.updateSubCategory(
      Number(categoryId),
      Number(subCategoryId),
      dto,
    )
  }

  @Delete(':id/sub-category/:subCategoryId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SubCategory deleted',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deleteSubCategory(
    @Param('id') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<T_SubCategoryDelete> {
    return this.subCategoriesService.deleteSubCategory(
      Number(categoryId),
      Number(subCategoryId),
    )
  }
}
