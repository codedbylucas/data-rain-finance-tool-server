import { Injectable } from '@nestjs/common';
import { Either, left, rigth } from 'src/app/infra/shared/either/either';
import { GatewayController } from '../../controllers/gateway.controller';
import { GatewayService } from '../../services/gateway.service';
import { NotificationEntity } from '../notification/entities/notification.entity';
import { SendingNotificationError } from './errors/sending-notification.error';
import { NewNotificationPayload } from './protocols/new-notification.payload';

@Injectable()
export class NotificationEmitter {
  constructor(
    private readonly gatewayController: GatewayController,
    private readonly gatewayService: GatewayService,
  ) {}

  sendToAUser(
    notification: NotificationEntity,
  ): Either<SendingNotificationError, NotificationEntity> {
    const user = this.gatewayService.findUserById(notification.receiverId);

    if (!user) {
      return left(
        new SendingNotificationError(
          'User not connected, notification not sent',
        ),
      );
    }

    delete notification.sent;
    this.gatewayController.server
      .to(user.clientId)
      .emit('new-notification', notification as NewNotificationPayload);

    return rigth(notification);
  }
}
