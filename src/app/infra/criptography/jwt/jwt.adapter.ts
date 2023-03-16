import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface DecodedToken {
  userId: string;
}

@Injectable()
export class JwtAdapter {
  constructor(private readonly jwtService: JwtService) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await this.jwtService.sign({ userId: value });
    return accessToken;
  }

  verifyToken(accessToken: string): DecodedToken {
    try {
      const decoded = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET_KEY,
      }) as DecodedToken;
      const userId = decoded.userId;
      return { userId };
    } catch (error) {
      console.log(error);
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException(`Token expired`);
      } else {
        throw new BadRequestException(`Token is invalid`);
      }
    }
  }
}
