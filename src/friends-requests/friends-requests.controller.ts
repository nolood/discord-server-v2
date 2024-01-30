import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendsRequestsService } from './friends-requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Заявки в друзья')
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

  @UseGuards(JwtAuthGuard)
  @Delete('/reject/:id')
  rejectFriendRequest(
    @Param('id', ParseIntPipe) requestId: number,
    @Req() { userId: recipientId }: { userId: number },
  ) {
    return this.friendsRequestsService.rejectFriendRequest(
      requestId,
      recipientId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/accept/:id')
  acceptFriendRequest(
    @Param('id', ParseIntPipe) requestId: number,
    @Req() { userId: recipientId }: { userId: number },
  ) {
    return this.friendsRequestsService.acceptFriendRequest(
      requestId,
      recipientId,
    );
  }
}
