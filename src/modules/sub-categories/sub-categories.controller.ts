import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common/decorators'
import { Controller, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto'
import { T_SubCategory, T_SubCategoryDelete } from './models'
import { SubCategoriesService } from './sub-categories.service'

@Controller('api/categories')
@ApiTags('Sub-categories')
export class SubCategoriesController {
  constructor(private subCategoriesService: SubCategoriesService) {}

  @Get(':categoryId/sub-categories')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sub-categories fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getAllSubCategories(
    @Param('categoryId') categoryId: string,
  ): Promise<T_SubCategory[]> {
    return this.subCategoriesService.getAllSubCategories(Number(categoryId))
  }

  @Get(':categoryId/sub-categories/:subCategoryId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sub-category fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getSubCategory(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<T_SubCategory> {
    return this.subCategoriesService.getSubCategory(
      Number(categoryId),
      Number(subCategoryId),
    )
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':categoryId/sub-categories')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sub-category created',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createSubCategory(
    @Param('categoryId') categoryId: string,
    @Req() req: Request,
    @Body() dto: CreateSubCategoryDto,
  ): Promise<T_SubCategory> {
    const user = req.user
    return this.subCategoriesService.createSubCategory(
      Number(categoryId),
      Number(user['sub']),
      dto,
    )
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put(':categoryId/sub-categories/:subCategoryId')
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
    @Req() req: Request,
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Body() dto: UpdateSubCategoryDto,
  ): Promise<T_SubCategory> {
    const user = req.user
    return this.subCategoriesService.updateSubCategory(
      Number(categoryId),
      Number(subCategoryId),
      dto,
      Number(user['sub']),
    )
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':categoryId/sub-categories/:subCategoryId')
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
    @Req() req: Request,
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<T_SubCategoryDelete> {
    const user = req.user
    return this.subCategoriesService.deleteSubCategory(
      Number(categoryId),
      Number(subCategoryId),
      Number(user['sub']),
    )
  }
}
