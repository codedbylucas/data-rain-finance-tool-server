import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { Either, rigth } from '../shared/either/either';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './service/dto/create-user.dto';
import { UserService } from './service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<Either<BadRequestException, UserEntity>> {
    const user = await this.userService.createUser(dto);
    if (user.isLeft()) {
      throw user.value;
    }
    return rigth(user.value);
  }
}
