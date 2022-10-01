import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCategoryDto {
  @ApiProperty({ default: 'title' })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  title: string

  @ApiProperty({ default: 'description' })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({ default: false })
  @IsOptional()
  isActive: boolean
}
