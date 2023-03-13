import { Injectable } from '@nestjs/common';
import { UserService } from 'src/app/user/service/user.service';
import { formatDateObjectToString } from 'src/app/util/format-date-object-to-string';
import { NotificationEmitter } from '../../../notification.emitter';
import { CreateNotificationDto } from '../../../service/dto/create-notification.dto';
import { NotificationService } from '../../../service/notification.service';
import { RequestSendOvertimeStatusProps } from '../protocols/request-send-overtime-status.props';
import { RequestSendOvertimeStatusDto } from './dto/request-send-overtime-status.dto';

@Injectable()
export class ProfessionalServicesNotificationService {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly notificationEmitter: NotificationEmitter,
  ) {}

  async requestStatusChangeToSubmitOvertime(dto: RequestSendOvertimeStatusDto) {
    try {
      const senderOrError = await this.userService.findUserById(dto.senderId);
      const dateToSendTImeFormated = formatDateObjectToString(
        dto.dateToSendTime,
      );

      let notification: CreateNotificationDto = null;
      if (dto.approved) {
        notification = this.returnApprovalNotification({
          senderId: dto.senderId,
          receiverId: dto.receiverId,
          senderName: senderOrError.name,
          dateToSendTime: dateToSendTImeFormated,
          imageUrl: senderOrError.imageUrl,
          projectId: dto.projectId,
        });
      }

      const notificationOrError =
        this.notificationService.createNotification(notification);

      if (notificationOrError.isLeft()) {
        this.notificationEmitter.sendError(
          dto.senderId,
          notificationOrError.value,
        );
      }
    } catch (error) {
      console.log('ProfessionalServicesNotificationServiceError:', error);
    }
  }

  private returnApprovalNotification(
    props: RequestSendOvertimeStatusProps,
  ): CreateNotificationDto {
    const notification: CreateNotificationDto = {
      receiverId: props.receiverId,
      route: `/request-send-overtime/user/status/${props.projectId}`,
      title: `Pedido aprovado`,
      message: `${props.senderName} aprovou seu pedido para realizar horas extras no dia ${props.dateToSendTime}`,
      imageUrl: props.imageUrl,
      type: 'overtime_status',
    };
    return notification;
  }
}
