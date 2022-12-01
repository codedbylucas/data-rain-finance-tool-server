import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './service/dto/create-user.dto';
import { UserService } from './service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }
}
