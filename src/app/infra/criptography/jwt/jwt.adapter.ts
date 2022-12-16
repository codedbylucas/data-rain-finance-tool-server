import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAdapter {
  constructor(private readonly jwtService: JwtService) {}
  async encrypt(value: string): Promise<string> {
    const accessToken = await this.jwtService.sign({ userId: value });
    return accessToken;
  }
}
