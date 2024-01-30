import { forwardRef, Module } from '@nestjs/common';
import { FriendsRequestsController } from './friends-requests.controller';
import { FriendsRequestsService } from './friends-requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsRequests } from './friends-requests.model';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/users.model';
import { FriendsRequestGateway } from './friends-request.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendsRequests, User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [FriendsRequestsController],
  providers: [FriendsRequestsService, FriendsRequestGateway],
})
export class FriendsRequestsModule {}
