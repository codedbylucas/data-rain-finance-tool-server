import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Either, left, rigth } from 'src/app/infra/shared/either/either';
import { createUuid } from 'src/app/util/create-uuid';
import { GatewayService } from '../../../services/gateway.service';
import { NotificationEntity } from '../entities/notification.entity';
import { InvalidParamError } from '../errors/invalid-param.error';
import { NotificationEmitter } from '../notification.emitter';
import { UpdateNotificationProps } from '../protocols/props/update-notification.props';
import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notiticationRepository: NotificationRepository,
    private readonly gatewayService: GatewayService,
    private readonly notificationEmitter: NotificationEmitter,
  ) {}

  createNotification(
    dto: CreateNotificationDto,
  ): Either<InvalidParamError, NotificationEntity> {
    if (!isUUID(dto.receiverId)) {
      return left(new InvalidParamError(`The receiver id must be a uuid`));
    }
    if (dto.message.length < 3 || dto.message.length > 100) {
      return left(
        new InvalidParamError(
          `Notification message must contain between 3 and 100 characters`,
        ),
      );
    }
    if (dto.title.length < 3 || dto.title.length > 50) {
      return left(
        new InvalidParamError(
          `Notification title must contain between 3 and 30 characters`,
        ),
      );
    }

    const notificationId = createUuid();
    this.notiticationRepository.save(dto.receiverId, {
      ...dto,
      id: notificationId,
      visualized: false,
      createdAt: new Date(),
      sent: false,
    });

    const notification = this.notiticationRepository.findNotificationById(
      notificationId,
      dto.receiverId,
    );

    const userIsConnected = this.gatewayService.userIsConnected(dto.receiverId);
    if (userIsConnected) {
      const sendToAUser = this.notificationEmitter.sendToAUser(notification);

      if (sendToAUser.isRigth()) {
        const index = this.notiticationRepository.findNotificationIndex(
          dto.receiverId,
          notificationId,
        );

        const notificationSent = this.updateNotification(index, {
          receiverId: dto.receiverId,
          notificationId,
          sent: true,
          visualized: false,
        });

        return rigth(notificationSent);
      }
    }
  }

  updateNotification(
    index: number,
    props: UpdateNotificationProps,
  ): NotificationEntity {
    this.notiticationRepository.updateNotification(index, {
      receiverId: props.receiverId,
      notificationId: props.notificationId,
      sent: props.sent,
      visualized: props.visualized,
    });

    const notificationSent = this.notiticationRepository.findNotificationById(
      props.notificationId,
      props.receiverId,
    );

    return notificationSent;
  }

  checkNotificationToSend(receiverId: string): void {
    const unsentNotifications =
      this.notiticationRepository.findUnsentNotifications(receiverId);

    if (!unsentNotifications || unsentNotifications.length === 0) {
      return null;
    }

    for (const notification of unsentNotifications) {
      this.notificationEmitter.sendToAUser(notification);
      const index = this.notiticationRepository.findNotificationIndex(
        receiverId,
        notification.id,
      );

      this.updateNotification(index, {
        notificationId: notification.id,
        receiverId,
        sent: true,
        visualized: false,
      });
    }
  }
}
