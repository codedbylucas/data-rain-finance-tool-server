import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { Either, rigth } from '../shared/either/either';
import { CreateUserDto } from './service/dto/create-user.dto';
import { UserService } from './service/user.service';
import { UserCreatedResponse } from './types/user-created-response.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<BadRequestException | UserCreatedResponse> {
    const userOrError = await this.userService.createUser(dto);
    if (userOrError.isLeft()) {
      throw userOrError.value;
    }
    return userOrError.value;
  }

  
}
