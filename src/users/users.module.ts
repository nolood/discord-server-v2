import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.model';
import { FriendsRequests } from '../friends-requests/friends-requests.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendsRequests])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule.forFeature([User, FriendsRequests])],
})
export class UsersModule {}
