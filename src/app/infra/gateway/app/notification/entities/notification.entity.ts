export interface NotificationEntity {
  id: string;
  receiverId: string;
  route: string;
  title: string;
  message: string;
  visualized: boolean;
  sent: boolean;
  createdAt: Date;
}
