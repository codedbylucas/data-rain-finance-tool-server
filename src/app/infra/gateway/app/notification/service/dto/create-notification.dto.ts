import { NotificationTypes } from '../../entities/notification.entity';

export interface CreateNotificationDto {
  receiverId: string;
  route: string;
  title: string;
  message: string;
  imageUrl: string;
  type: NotificationTypes;
}
