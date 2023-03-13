import { GatewayError } from '../../../protocols/errors/gateway.error';

export class SendingNotificationError extends Error implements GatewayError {
  constructor(message: string) {
    super(message);
    this.name = 'SendingNotificationError';
  }
}
