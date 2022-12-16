import { Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';

@Injectable()
export default class CryptrService {
  private readonly cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);

  encrypt(value: string): string {
    const encryptedValue = this.cryptr.encrypt(value);
    return encryptedValue;
  }

  decrypt(value: string): string {
    const decryptedValue = this.cryptr.decrypt(value);
    return decryptedValue;
  }
}
