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
  private defaultOptions: jwt.SignOptions = { expiresIn: '1h' };

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
    } catch (error: any) {
      console.log(error);
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException(`Token expired`);
      } else {
        throw new BadRequestException(`Token is invalid`);
      }
    }
  }
}
