import { Injectable } from '@nestjs/common';
import { UserService } from 'src/app/user/service/user.service';
import { formatDateObjectToString } from 'src/app/util/format-date-object-to-string';
import { CreateNotificationDto } from '../../../service/dto/create-notification.dto';
import { NotificationService } from '../../../service/notification.service';
import { AskPermissionToSendOvertimeDto } from './dto/ask-permission-to-send-overtime.dto';

@Injectable()
export class ManagerNotificationService {
  constructor(
    private readonly userService: UserService,

    private readonly notificationService: NotificationService,
  ) {}

  async askPermissionToSendOvertime(
    dto: AskPermissionToSendOvertimeDto,
  ): Promise<void> {
    const userOrError = await this.userService.findUserById(dto.senderId);
    const dateToSendTImeFormated = formatDateObjectToString(dto.dateToSendTime);

    const notification: CreateNotificationDto = {
      receiverId: dto.receiverId,
      route: '/request-send-overtime',
      title: `Pedido para realizar horas extras`,
      message: `${userOrError.name} fez um pedido para realizar horas extras no dia ${dateToSendTImeFormated}`,
    };

    this.notificationService.createNotification(notification);
  }
}
