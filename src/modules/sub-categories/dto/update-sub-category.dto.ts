import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateSubCategoryDto {
  @ApiProperty({ default: 'title' })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({ default: 'description' })
  @IsOptional()
  @IsString()
  description?: string
}
