import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Either, left, rigth } from '../../shared/either/either';

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

  verifyToken(
    accessToken: string,
  ): Either<BadRequestException | InternalServerErrorException, DecodedToken> {
    try {
      const decoded = this.jwtService.decode(accessToken) as DecodedToken;
      if (!decoded) {
        return left(new BadRequestException('Invalid token'));
      }

      const userId = decoded.userId;
      return rigth({ userId });
    } catch (error) {
      console.log(error);
      return left(
        new InternalServerErrorException('Invalid or malformed token'),
      );
    }
  }
}
