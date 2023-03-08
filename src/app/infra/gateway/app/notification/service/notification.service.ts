import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { left } from 'src/app/infra/shared/either/either';
import { createUuid } from 'src/app/util/create-uuid';
import { InvalidParamError } from '../errors/invalid-param.error';
import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notiticationRepository: NotificationRepository,
  ) {}

  createNotification(dto: CreateNotificationDto) {
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
    if (dto.title.length < 3 || dto.message.length > 30) {
      return left(
        new InvalidParamError(
          `Notification title must contain between 3 and 30 characters`,
        ),
      );
    }

    this.notiticationRepository.save(dto.receiverId, {
      ...dto,
      id: createUuid(),
      visualized: false,
      createdAt: new Date(),
    });
  }
}
