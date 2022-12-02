import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtAdapter {
  async encrypt(value: string, secret: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, secret);
    return accessToken;
  }
}
