import { Injectable } from '@nestjs/common';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository {
  private notificationData: { [receiverId: string]: NotificationEntity[] } = {};

  save(receiverId: string, notification: NotificationEntity) {
    if (!this.notificationData[receiverId]) {
      this.notificationData[receiverId] = [];
    }
    this.notificationData[receiverId].push(notification);
  }

  findNotificationById(
    notificationId: string,
    receiverId: string,
  ): NotificationEntity {
    const notification = this.notificationData[receiverId].find(
      (notification) => notification.id === notificationId,
    );
    return notification;
  }
}
