import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { OrderItem } from './order-item.dto'

export class UpdateOrderDto {
  @ApiProperty({ default: 'title' })
  @IsOptional()
  @IsString()
  title: string

  @ApiProperty({ default: 'comment' })
  @IsOptional()
  @IsString()
  comment: string

  @ApiProperty({
    default: [
      {
        itemId: 1,
        count: 1,
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[]
}
