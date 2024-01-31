import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { FriendsRequestsModule } from './friends-requests/friends-requests.module';
import { FriendsRequests } from './friends-requests/friends-requests.model';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { Chat } from './chats/chats.model';
import { Message } from './messages/messages.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [FriendsRequests, User, Chat, Message],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    FriendsRequestsModule,
    ChatsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
