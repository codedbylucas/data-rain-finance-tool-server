import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { serverError } from 'src/app/util/server-error';

@Injectable()
export class BcryptAdapter {
  async hash(value: string, salt: number): Promise<string> {
    const hash = await bcrypt.hash(value, salt).catch(serverError);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash).catch(serverError);
    return isValid;
  }
}
