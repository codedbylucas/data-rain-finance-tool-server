import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Either, left, rigth } from 'src/app/shared/either/either';
import { UserEntity } from 'src/app/user/entities/user.entity';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { BcryptService } from './criptography/bcrypt/bcrypt.service';
import { JwtAdapter } from './criptography/jwt/jwt.adapter';
import { LoginResponse } from './criptography/types/login-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Either<UnauthorizedException, UserEntity>> {
    const userOrNull = await this.userRepository.findUserByEmail(email);
    if (!userOrNull) {
      return left(new UnauthorizedException('Invalid email and/or password!'));
    }

    const isPasswordValid = await this.bcryptService.compare(
      password,
      userOrNull.password,
    );

    if (!isPasswordValid) {
      return left(new UnauthorizedException('Invalid email and/or password!'));
    }

    return rigth(userOrNull);
  }

  async login(user: UserEntity): Promise<LoginResponse> {
    const userIdEncrypted = await this.jwtAdapter.encrypt(
      user.id,
      process.env.JWT_SECRET,
    );

    return {
      token: userIdEncrypted,
    };
  }
}
