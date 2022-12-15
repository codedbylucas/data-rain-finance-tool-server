import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/app/user/entities/user.entity';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { BcryptAdapter } from '../criptography/bcrypt/bcrypt.adapter';
import { JwtAdapter } from '../criptography/jwt/jwt.adapter';
import { LoginResponse } from '../protocols/login-response';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async validateUser(dto: LoginDto): Promise<UserEntity> {
    const { password, email } = dto;
    const userOrNull = await this.userRepository.findUserByEmail(email);
    if (!userOrNull) {
      throw new UnauthorizedException('Invalid email and/or password!');
    }

    const isPasswordValid = await this.bcryptAdapter.compare(
      password,
      userOrNull.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email and/or password!');
    }

    return userOrNull;
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const userOrError = await this.validateUser(dto);

    const userIdEncrypted = await this.jwtAdapter.encrypt(
      userOrError.id,
      process.env.JWT_SECRET,
    );

    return {
      token: userIdEncrypted,
      user: {
        id: userOrError.id,
        name: userOrError.name,
        email: userOrError.email,
        imageUrl: userOrError.imageUrl,
        position: userOrError.position,
        roleName: userOrError.roleName,
      },
    };
  }
}
