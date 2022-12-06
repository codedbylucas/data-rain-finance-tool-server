import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllUsersResponse } from './protocols/find-all-users-response';
import { FindUserResponse } from './protocols/find-user-response';
import { ProfilePictureResponse } from './protocols/profile-picture-response';
import { UserCreatedResponse } from './protocols/user-created-response';
import { CreateUserDto } from './service/dto/create-user.dto';
import { UpdateUserDto } from './service/dto/update-user.dto';
import { UserService } from './service/user.service';

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
    return await this.userService.createUser(dto);
  }

  @Post('profile-picture/:id')
  @ApiOperation({
    summary: 'Add profile picture for user',
  })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5000000 } }))
  async insertProfilePicture(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfilePictureResponse> {
    return await this.userService.insertProfilePicture(id, file);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a user by id',
  })
  async findUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BadRequestException | FindUserResponse> {
    return await this.userService.findUserById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  async findUser(): Promise<BadRequestException | FindAllUsersResponse[]> {
    return await this.userService.findAllUsers();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by id',
  })
  async updateUserSelfById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<BadRequestException | void> {
    return await this.userService.updateUserSelfById(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a user by id',
  })
  async deleteUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BadRequestException | void> {
    await this.userService.deleteUserById(id);
  }
}
