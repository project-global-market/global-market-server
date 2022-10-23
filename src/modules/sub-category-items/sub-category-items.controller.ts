import { Controller, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SubCategoriesItemsService } from './sub-category-items.service'
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
import { T_SubCategoryItem, T_SubCategoryItemDelete } from './models'
import { CreateSubCategoryItemDto } from './dto'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@Controller('api/categories')
@ApiTags('Items')
export class SubCategoryItemsController {
  constructor(private subCategoriesItemsService: SubCategoriesItemsService) {}

  @Get(':categoryId/sub-categories/:subCategoryId/items')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Items fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getAllSubCategoryItems(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<T_SubCategoryItem[]> {
    return this.subCategoriesItemsService.getAllSubCategoryItems(
      Number(categoryId),
      Number(subCategoryId),
    )
  }

  @Get(':categoryId/sub-categories/:subCategoryId/items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getSubCategoryItem(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('itemId') itemId: string,
  ): Promise<T_SubCategoryItem> {
    return this.subCategoriesItemsService.getSubCategoryItem(
      Number(categoryId),
      Number(subCategoryId),
      Number(itemId),
    )
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':categoryId/sub-categories/:subCategoryId/items')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Item created',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createSubCategoryItem(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Req() req: Request,
    @Body() dto: CreateSubCategoryItemDto,
  ): Promise<T_SubCategoryItem> {
    const user = req.user
    return this.subCategoriesItemsService.createSubCategoryItem(
      Number(categoryId),
      Number(subCategoryId),
      Number(user['sub']),
      dto,
    )
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put(':categoryId/sub-categories/:subCategoryId/items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item updated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updateSubCategoryItem(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('itemId') itemId: string,
    @Req() req: Request,
    @Body() dto: CreateSubCategoryItemDto,
  ): Promise<T_SubCategoryItem> {
    const user = req.user
    return this.subCategoriesItemsService.updateSubCategoryItem(
      Number(categoryId),
      Number(subCategoryId),
      Number(itemId),
      Number(user['sub']),
      dto,
    )
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':categoryId/sub-categories/:subCategoryId/items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item deleted',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deleteSubCategoryItem(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('itemId') itemId: string,
    @Req() req: Request,
  ): Promise<T_SubCategoryItemDelete> {
    const user = req.user
    return this.subCategoriesItemsService.deleteSubCategoryItem(
      Number(categoryId),
      Number(subCategoryId),
      Number(itemId),
      Number(user['sub']),
    )
  }
}
