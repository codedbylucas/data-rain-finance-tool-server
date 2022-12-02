import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Either, left, rigth } from 'src/app/shared/either/either';
import { UserEntity } from 'src/app/user/entities/user.entity';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { BcryptService } from './criptography/bcrypt/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Either<UnauthorizedException, UserEntity>> {
    const userOrNull = await this.userRepository.findUserByEmail(email);
    if (!userOrNull) {
      return left(new UnauthorizedException('Invalid email and/or password!'));
    }

    const isPasswordValid = this.bcryptService.compare(
      password,
      userOrNull.password,
    );

    if (!isPasswordValid) {
      return left(new UnauthorizedException('Invalid email and/or password!'));
    }

    return rigth(userOrNull);
  }

  async login(user: UserEntity) {}
}
