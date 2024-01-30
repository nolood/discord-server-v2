import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/self')
  getSelf(@Req() { userId }: { userId: number }) {
    return this.usersService.getUser(userId);
  }
}
