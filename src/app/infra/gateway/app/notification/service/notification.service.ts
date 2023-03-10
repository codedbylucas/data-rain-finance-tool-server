import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Either, left, rigth } from 'src/app/infra/shared/either/either';
import { createUuid } from 'src/app/util/create-uuid';
import { GatewayService } from '../../../services/gateway.service';
import { NotificationEntity } from '../entities/notification.entity';
import { InvalidParamError } from '../errors/invalid-param.error';
import { NotificationEmitter } from '../notification.emitter';
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

    const id = createUuid();
    this.notiticationRepository.save(dto.receiverId, {
      ...dto,
      id,
      visualized: false,
      createdAt: new Date(),
      sent: false,
    });

    const notification = this.notiticationRepository.findNotificationById(
      id,
      dto.receiverId,
    );

    const userIsConnected = this.gatewayService.userIsConnected(dto.receiverId);
    if (userIsConnected) {
      const sendToAUser = this.notificationEmitter.sendToAUser(notification);

      if(sendToAUser.isRigth()) {
        
      }
    }
  }
}
