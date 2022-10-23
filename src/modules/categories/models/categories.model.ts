import { Category } from '@prisma/client'

export type T_Category = Omit<Category, '_count'>

export type T_CategoryDelete = {
  categoryId: number
  message: string
}
