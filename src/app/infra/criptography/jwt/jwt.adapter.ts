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

  async verifyToken(accessToken: string) {
    try {
      const decoded = (await this.jwtService.decode(
        accessToken,
      )) as DecodedToken;
      const userId = decoded.userId;
      return { userId };
    } catch (error) {
      console.log(error);
    }
  }
}
