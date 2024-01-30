import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FriendsRequestsService } from './friends-requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('friends/requests')
export class FriendsRequestsController {
  constructor(
    private readonly friendsRequestsService: FriendsRequestsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  makeFriendRequest(
    @Param('id') recipientId: number,
    @Req() { userId }: { userId: number },
  ) {
    console.log(userId);
    return this.friendsRequestsService.makeFriendRequest(recipientId);
  }
}
