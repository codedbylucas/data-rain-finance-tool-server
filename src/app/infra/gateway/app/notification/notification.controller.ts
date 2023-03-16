import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedUser } from 'src/app/auth/decorators/logged-user.decorator';
import { NotificationService } from './service/notification.service';

@Controller('notification')
@ApiTags('notification')
export class NotificationControlelr {
  constructor(private readonly notificationService: NotificationService) {}

  @Patch('visualized/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Make notification visualized',
  })
  viewNotification(
    @Param('id', new ParseUUIDPipe()) notificationId: string,
    @LoggedUser() userId: string,
  ) {
    return this.notificationService.viewNotification(userId, notificationId);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find all user notifications',
  })
  findAllUserNotifications(@LoggedUser() userId: string) {
    return this.notificationService.findAllUserNotifications(userId);
  }
}
