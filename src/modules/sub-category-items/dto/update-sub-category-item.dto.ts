import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateSubCategoryItemDto {
  @ApiProperty({ default: 'title' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ default: 'description' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  price?: number

  @ApiProperty({ default: 'image' })
  @IsOptional()
  @IsString()
  image?: string
}
