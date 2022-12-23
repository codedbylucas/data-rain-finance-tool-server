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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoggedUser } from '../auth/decorators/logged-user.decorator';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { FindUserResponse } from './protocols/find-user-response';
import { ProfilePictureResponse } from './protocols/profile-picture-response';
import { CreateUserDto } from './service/dto/create-user.dto';
import { UpdateUserDto } from './service/dto/update-user.dto';
import { UserService } from './service/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @UseGuards(AuthGuard())
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'User is created',
  })
  async createUser(
    // @RolesAccess([Role.admin]) userId: string,
    @Body() dto: CreateUserDto,
  ): Promise<BadRequestException | void> {
    return await this.userService.createUser(dto);
  }

  @Post('profile-picture')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'insert photo in your profile',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5000000 } }))
  async insertProfilePicture(
    @LoggedUser() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfilePictureResponse> {
    return await this.userService.insertProfilePicture(userId, file);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find a user by id',
  })
  async findUserById(
    // @RolesAccess([Role.admin]) userId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BadRequestException | FindUserResponse> {
    return await this.userService.findUserById(id);
  }

  @Get()
  // @UseGuards(AuthGuard())
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find all users',
  })
  async findAllUsers(): // @RolesAccess([Role.admin]) userId: string,
  Promise<BadRequestException | FindUserResponse[]> {
    return await this.userService.findAllUsers();
  }

  @Patch()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update yourself',
  })
  async updateOwnUser(
    @LoggedUser() userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<BadRequestException | void> {
    return await this.userService.updateOwnUser(userId, dto);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard())
  // @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a user by id',
  })
  async deleteUserById(
    // @RolesAccess([Role.admin]) userId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BadRequestException | void> {
    await this.userService.deleteUserById(id);
  }
}
