import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
      const decoded = this.jwtService.decode(accessToken) as DecodedToken;
      if (!decoded) {
        throw new BadRequestException('Invalid token');
      }
      const userId = decoded.userId;
      return { userId };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Invalid or malformed token');
    }
  }
}
