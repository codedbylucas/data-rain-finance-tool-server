import { Injectable } from '@nestjs/common';
import { NotificationEntity } from '../entities/notification.entity';
import { UpdateNotificationProps } from '../protocols/props/update-notification.props';

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

  findNotificationIndex(receiverId: string, notificationId: string): number {
    for (let i = 0; i < this.notificationData[receiverId].length; i++) {
      if (this.notificationData[receiverId][i].id === notificationId) {
        return i;
      }
    }
  }

  updateNotification(index: number, props: UpdateNotificationProps) {
    if (props.sent) {
      this.notificationData[props.receiverId][index].sent = props.sent;
    }
    if (props.visualized) {
      this.notificationData[props.receiverId][index].visualized =
        props.visualized;
    }
  }

  findUnsentNotifications(receiverId: string): NotificationEntity[] {
    const notifications = this.notificationData[receiverId].filter(
      (notification) => notification.sent === false,
    );
    return notifications;
  }
}
