import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './service/dto/create-user.dto';
import { UserService } from './service/user.service';
import { FindAllUsersResponse } from './types/find-all-users-response';
import { FindUserResponse } from './types/find-user-response';
import { UserCreatedResponse } from './types/user-created-response.type';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'User is created',
  })
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<BadRequestException | UserCreatedResponse> {
    const userOrError = await this.userService.createUser(dto);
    if (userOrError.isLeft()) {
      throw userOrError.value;
    }
    return userOrError.value;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a user by id',
  })
  async findUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BadRequestException | FindUserResponse> {
    const userOrError = await this.userService.findUserById(id);
    if (userOrError.isLeft()) {
      throw userOrError.value;
    }
    return userOrError.value;
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  async findUser(): Promise<BadRequestException | FindAllUsersResponse[]> {
    const userOrError = await this.userService.findAllUsers();
    if (userOrError.isLeft()) {
      throw userOrError.value;
    }
    return userOrError.value;
  }
}
