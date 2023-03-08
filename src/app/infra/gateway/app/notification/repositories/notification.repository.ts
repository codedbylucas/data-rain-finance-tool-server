import { Injectable } from '@nestjs/common';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository {
  private notificationData: { [receiverId: string]: [NotificationEntity] };

  save(receiverId: string, notification: NotificationEntity) {
    this.notificationData[receiverId].push(notification);
  }
}
