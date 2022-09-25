import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { RoleValue } from '@prisma/client'

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  username: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  role: RoleValue
}
