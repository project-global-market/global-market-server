import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from 'modules/auth/auth.module'
import { CategoriesModule } from 'modules/categories/categories.module'
import { PrismaModule } from 'modules/prisma/prisma.module'
import { UsersModule } from 'modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UsersModule,
    CategoriesModule,
  ],
})
export class AppModule {}
