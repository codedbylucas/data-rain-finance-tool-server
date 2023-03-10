import { NotificationError } from './notification.error';

export class SendingNotificationError
  extends Error
  implements NotificationError
{
  constructor(message: string) {
    super(message);
    this.name = 'SendingNotificationError';
  }
}
