import { BadGatewayException, Injectable } from '@nestjs/common';
import { DecodedToken, JwtAdapter } from '../../criptography/jwt/jwt.adapter';
import { GatewayRepository } from '../repositories/gateway.repository';

@Injectable()
export class GatewayService {
  constructor(
    private readonly gatewayRepository: GatewayRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async handleConnection(clientId: string, token: string) {
    console.log(token);
    const decodedToken = await this.decodeToken(token);
  }

  async decodeToken(token: string): Promise<DecodedToken> {
    const decodedToken = await this.jwtAdapter.verifyToken(token);
    if (!decodedToken) {
      console.log(decodedToken, '111');
      return null;
    }
    return decodedToken;
  }
}
