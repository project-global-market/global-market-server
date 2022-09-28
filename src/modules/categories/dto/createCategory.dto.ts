import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({ default: 'title' })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({ default: 'description' })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean
}
