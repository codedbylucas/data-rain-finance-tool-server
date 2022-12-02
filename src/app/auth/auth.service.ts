import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Either, left, rigth } from 'src/app/shared/either/either';
import { UserEntity } from 'src/app/user/entities/user.entity';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { BcryptService } from './criptography/bcrypt/bcrypt.service';
import { JwtAdapter } from './criptography/jwt/jwt.adapter';
import { LoginResponse } from './criptography/types/login-response';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async validateUser(
    dto: LoginDto,
  ): Promise<Either<UnauthorizedException, UserEntity>> {
    const { password, email } = dto;
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

  async login(dto: LoginDto): Promise<LoginResponse> {
    const userOrError = await this.validateUser(dto);
    if (userOrError.isLeft()) {
      throw userOrError.value;
    }

    const userIdEncrypted = await this.jwtAdapter.encrypt(
      userOrError.value.id,
      process.env.JWT_SECRET,
    );

    return {
      token: userIdEncrypted,
    };
  }
}
