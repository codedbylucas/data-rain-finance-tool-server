import { Injectable } from '@nestjs/common';
import { UserService } from 'src/app/user/service/user.service';
import { formatDateObjectToString } from 'src/app/util/format-date-object-to-string';
import { SendingNotificationError } from '../../../errors/sending-notification.error';
import { NotificationEmitter } from '../../../notification.emitter';
import { CreateNotificationDto } from '../../../service/dto/create-notification.dto';
import { NotificationService } from '../../../service/notification.service';
import { AskPermissionToSendOvertimeForAdminDto } from './dto/ask-permission-to-send-overtime.dto';

@Injectable()
export class AdminNotificationService {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly notificationEmitter: NotificationEmitter,
  ) {}

  async askPermissionToSendOvertime(
    dto: AskPermissionToSendOvertimeForAdminDto,
  ): Promise<void> {
    const userOrError = await this.userService.findUserById(dto.senderId);
    const dateToSendTImeFormated = formatDateObjectToString(dto.dateToSendTime);
    const adminId = await this.userService.findTheAdminId();

    if (!adminId) {
      this.notificationEmitter.sendError(
        dto.senderId,
        new SendingNotificationError(
          'There was an error sending the notification to Admin',
        ),
      );
      return;
    }
    const notification: CreateNotificationDto = {
      receiverId: adminId,
      route: '/request-send-overtime',
      title: `Pedido para realizar horas extras`,
      message: `${userOrError.name} fez um pedido para realizar horas extras no dia ${dateToSendTImeFormated}`,
    };

    const notificationOrError =
      this.notificationService.createNotification(notification);

    if (notificationOrError.isLeft()) {
      this.notificationEmitter.sendError(
        dto.senderId,
        notificationOrError.value,
      );
    }
  }
}
