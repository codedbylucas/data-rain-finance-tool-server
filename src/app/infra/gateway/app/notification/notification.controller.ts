import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
