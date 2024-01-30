import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsRequests } from './friends-requests.model';
import { Repository } from 'typeorm';
import { User } from '../users/users.model';
import { FriendsRequestGateway } from './friends-request.gateway';

@Injectable()
export class FriendsRequestsService {
  constructor(
    @InjectRepository(FriendsRequests)
    private readonly friendsRequestsRepository: Repository<FriendsRequests>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly friendsRequestGateway: FriendsRequestGateway,
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

    this.friendsRequestGateway.handleFriendRequest({
      senderId,
      recipientId,
    });

    return this.friendsRequestsRepository.save(newRequest);
  }

  async rejectFriendRequest(requestId: number, recipientId: number) {
    const request = await this.friendsRequestsRepository.findOne({
      where: { id: requestId },
      relations: ['recipient'],
    });

    if (!request) {
      throw new HttpException('invalid-request', HttpStatus.BAD_REQUEST);
    }

    if (request.recipient.id !== recipientId) {
      throw new HttpException('invalid-request', HttpStatus.BAD_REQUEST);
    }

    await this.friendsRequestsRepository.remove(request);

    return 'success';
  }

  async acceptFriendRequest(requestId: number, recipientId: number) {
    const request = await this.friendsRequestsRepository.findOne({
      where: { id: requestId },
      relations: ['recipient', 'sender'],
    });

    if (!request) {
      throw new HttpException('invalid-request', HttpStatus.BAD_REQUEST);
    }

    if (request.recipient.id !== recipientId) {
      throw new HttpException('invalid-request', HttpStatus.BAD_REQUEST);
    }

    const sender = await this.userRepository.findOne({
      where: { id: request.sender.id },
      relations: ['friends'],
    });

    const recipient = await this.userRepository.findOne({
      where: { id: recipientId },
      relations: ['friends'],
    });

    if (!sender || !recipient) {
      throw new HttpException('invalid-request-users', HttpStatus.BAD_REQUEST);
    }

    sender.friends.push(recipient);
    recipient.friends.push(sender);

    await this.userRepository.save(sender);
    await this.userRepository.save(recipient);

    return await this.userRepository.findOne({
      where: {
        id: sender.id,
      },
    });
  }
}
