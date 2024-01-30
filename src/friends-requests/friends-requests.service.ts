import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsRequests } from './friends-requests.model';
import { Repository } from 'typeorm';
import { User } from '../users/users.model';

@Injectable()
export class FriendsRequestsService {
  constructor(
    @InjectRepository(FriendsRequests)
    private readonly friendsRequestsRepository: Repository<FriendsRequests>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async makeFriendRequest(senderId: number, recipientId: number) {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });

    const recipient = await this.userRepository.findOne({
      where: { id: recipientId },
    });

    if (!sender || !recipient) {
      throw new HttpException('invalid-request-users', HttpStatus.BAD_REQUEST);
    }

    const request = await this.friendsRequestsRepository.findOne({
      where: {
        sender,
        recipient,
      },
    });

    if (request) {
      throw new HttpException('request-already-sent', HttpStatus.BAD_REQUEST);
    }

    const newRequest = this.friendsRequestsRepository.create({
      sender,
      recipient,
    });

    return this.friendsRequestsRepository.save(newRequest);
  }
}
