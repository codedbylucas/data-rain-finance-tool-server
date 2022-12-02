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
import { UserCreatedResponse } from './types/user-created-response.type';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'User is created',
  })
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

  @Get(':id')
  async findUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findUserById(id);
  }
}
