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
  Query,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LoggedUser } from '../auth/decorators/logged-user.decorator';
import { FindaManyUsersByQueryParamResponse } from './protocols/find-many-users-by-query-param.response';
import { FindUserResponse } from './protocols/find-user-response';
import { ProfilePictureResponse } from './protocols/profile-picture-response';
import { CreateUserDto } from './service/dto/create-user.dto';
import { UpdateOwnUserDto } from './service/dto/update-own-user.dto';
import { UpdateUserDto } from './service/dto/update-user.dto';
import { UserPasswordRecoveryDto } from './service/dto/user-password-recovery.dto';
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

  @Post('/password-recovery')
  @ApiOperation({
    summary: 'User is created',
  })
  async passwordRecovery(
    @Body() dto: UserPasswordRecoveryDto,
  ): Promise<BadRequestException | void> {
    return await this.userService.passwordRecovery(dto);
  }

  @Get('/myself')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find own user',
  })
  async findOwnUser(
    @LoggedUser() userId: string,
  ): Promise<BadRequestException | FindUserResponse> {
    return await this.userService.findUserById(userId);
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

  @Patch('myself')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update yourself',
  })
  async updateOwnUser(
    @LoggedUser() userId: string,
    @Body() dto: UpdateOwnUserDto,
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by id',
  })
  async updateUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<void> {
    return await this.userService.updateUserById(id, dto);
  }

  @Get('/managers/search')
  @ApiOperation({
    summary: 'Find managers by query param',
  })
  @ApiQuery({
    name: 'parameter',
    required: false,
    explode: false,
    type: String,
  })
  async findManyMangers(
    @Query('parameter') query: string,
  ): Promise<FindaManyUsersByQueryParamResponse> {
    return await this.userService.findaManyUsersByQueryParam(query, 'manager');
  }

  @Get('/professional-services/search')
  @ApiOperation({
    summary: 'Find profesisonal services by query param',
  })
  @ApiQuery({
    name: 'parameter',
    required: false,
    explode: false,
    type: String,
  })
  async findManyProfessionalServices(
    @Query('parameter') query: string,
  ): Promise<FindaManyUsersByQueryParamResponse> {
    return await this.userService.findaManyUsersByQueryParam(
      query,
      'professional services',
    );
  }
}
