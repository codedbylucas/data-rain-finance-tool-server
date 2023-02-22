import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface Payload {
  userId: string;
}

interface Token {
  token: string;
}

@Injectable()
export class JsonWebTokenAdapter {
  private secret: string = process.env.JWT_SECRET_KEY;
  private defaultOptions: jwt.SignOptions = { expiresIn: '30' };

  generateToken(payload: Payload): Token {
    const token = jwt.sign(payload, this.secret, {
      ...this.defaultOptions,
    });
    return { token };
  }

  verifyToken(token: string): Payload {
    try {
      const decoded = jwt.verify(token, this.secret) as Payload;
      return decoded;
    } catch (error) {
      throw new BadRequestException(`Token is invalid`);
    }
  }
}
