import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DecodedToken, JwtAdapter } from '../../criptography/jwt/jwt.adapter';
import { Either, left, rigth } from '../../shared/either/either';
import { GatewayRepository } from '../repositories/gateway.repository';

@Injectable()
export class GatewayService {
  constructor(
    private readonly gatewayRepository: GatewayRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  handleConnection(
    clientId: string,
    token: string,
  ): Either<BadGatewayException | InternalServerErrorException, DecodedToken> {
    const decodedToken = this.decodeToken(token);
    if (decodedToken.isLeft()) {
      return left(decodedToken.value);
    }
    return rigth(decodedToken.value);
  }

  decodeToken(
    token: string,
  ): Either<BadGatewayException | InternalServerErrorException, DecodedToken> {
    const decodedToken = this.jwtAdapter.verifyToken(token);
    return decodedToken;
  }
}
