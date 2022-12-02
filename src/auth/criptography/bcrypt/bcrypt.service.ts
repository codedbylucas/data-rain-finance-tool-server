import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(value: string, salt: number): Promise<string> {
    const hash = await bcrypt.hash(value, salt);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }
}
