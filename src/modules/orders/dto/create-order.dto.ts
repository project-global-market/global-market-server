import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

import { OrderItem } from './order-item.dto'

export class CreateOrderDto {
  @ApiProperty({ default: 'title' })
  @IsNotEmpty()
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
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[]
}
