import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from 'modules/auth/auth.module'
import { CategoriesModule } from 'modules/categories/categories.module'
import { InfoModule } from 'modules/info/info.module'
import { PrismaModule } from 'modules/prisma/prisma.module'
import { SubCategoriesModule } from 'modules/sub-categories/sub-categories.module'
import { SupportChatRoomsModule } from 'modules/support-chat-tickets/support-chat-tickets.module'
import { UsersModule } from 'modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UsersModule,
    CategoriesModule,
    SubCategoriesModule,
    SupportChatRoomsModule,
    InfoModule,
  ],
})
export class AppModule {}
