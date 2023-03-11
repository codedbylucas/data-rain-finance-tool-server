export interface NewNotificationPayload {
  id: string;
  receiverId: string;
  route: string;
  title: string;
  message: string;
  visualized: boolean;
}
