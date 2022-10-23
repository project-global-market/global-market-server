import { IsNotEmpty, IsNumber } from 'class-validator'

export class OrderItem {
  @IsNumber()
  @IsNotEmpty()
  itemId: number

  @IsNumber()
  @IsNotEmpty()
  count: number
}
