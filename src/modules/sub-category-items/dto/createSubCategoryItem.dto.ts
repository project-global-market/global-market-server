import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateSubCategoryItemDto {
  @ApiProperty({ default: 'title' })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({ default: 'description' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  @IsNumber()
  price: number

  @ApiProperty({ default: 'image' })
  @IsOptional()
  @IsString()
  image?: string
}
