import { NotificationError } from './notification.error';

export class InvalidParamError extends Error implements NotificationError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidParamError';
  }
}
