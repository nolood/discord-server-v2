import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto.username, dto.password);

    if (!user) {
      throw new UnauthorizedException('invalid-credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async registration(dto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (user) {
      throw new UnauthorizedException('user-exist');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 3);
    const newUser = await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
    });

    const payload = { username: newUser.username, sub: newUser.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
