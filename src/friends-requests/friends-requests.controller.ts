import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
    @Param('id', ParseIntPipe) recipientId: number,
    @Req() { userId: senderId }: { userId: number },
  ) {
    return this.friendsRequestsService.makeFriendRequest(senderId, recipientId);
  }
}
