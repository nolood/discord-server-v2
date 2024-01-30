import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async getUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['friends'],
    });

    if (!user) {
      throw new HttpException('user-not-found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
