import { forwardRef, Module } from '@nestjs/common';
import { FriendsRequestsController } from './friends-requests.controller';
import { FriendsRequestsService } from './friends-requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsRequests } from './friends-requests.model';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/users.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendsRequests, User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [FriendsRequestsController],
  providers: [FriendsRequestsService],
})
export class FriendsRequestsModule {}
