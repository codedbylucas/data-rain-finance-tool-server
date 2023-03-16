import { GatewayError } from '../../../protocols/errors/gateway.error';

export class InvalidParamError extends Error implements GatewayError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidParamError';
  }
}
