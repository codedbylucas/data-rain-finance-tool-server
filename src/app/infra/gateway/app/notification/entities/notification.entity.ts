export interface NotificationEntity {
  id: string;
  receiverId: string;
  route: string;
  title: string;
  message: string;
  visualized: boolean;
  imageUrl: string;
  type: NotificationTypes;
  sent: boolean;
  createdAt: Date;
}

export type NotificationTypes = 'request_send_overtime' | 'budget_request';
