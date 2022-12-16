import { BadRequestException, Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';
import { serverError } from 'src/app/util/server-error';

@Injectable()
export default class CryptrService {
  private readonly cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);

  encrypt(value: string): string {
    try {
      const encryptedValue = this.cryptr.encrypt(value);
      return encryptedValue;
    } catch (error) {
      return serverError(error);
    }
  }

  decrypt(value: string): string {
    try {
      const decryptedValue = this.cryptr.decrypt(value);
      return decryptedValue;
    } catch (error) {
      throw new BadRequestException('Token is invalid');
    }
  }
}
