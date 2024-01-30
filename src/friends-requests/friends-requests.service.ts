import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendsRequestsService {
  async makeFriendRequest(recipientId: number) {
    return 'kek';
  }
}
