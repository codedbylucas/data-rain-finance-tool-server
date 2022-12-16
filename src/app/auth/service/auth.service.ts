import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import CryptrService from 'src/app/infra/criptography/cryptr/cryptr.adapter';
import { UserEntity } from 'src/app/user/entities/user.entity';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { BcryptAdapter } from '../../infra/criptography/bcrypt/bcrypt.adapter';
import { JwtAdapter } from '../../infra/criptography/jwt/jwt.adapter';
import { LoginResponse } from '../protocols/login-response';
import { FirstAccessDto } from './dto/first-access.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter,
    private readonly cryptr: CryptrService,
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

    const userIdEncrypted = await this.jwtAdapter.encrypt(userOrError.id);

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

  async firstAccess(
    token: string,
    dto: FirstAccessDto,
  ): Promise<LoginResponse> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(
        `Password is different from confirm password`,
      );
    }
    delete dto.confirmPassword;
    const decryptToken = this.cryptr.decrypt(token);

    const hashPassword = await this.bcryptAdapter.hash(dto.password, 12);
    const userOrError = await this.userRepository.updateUserPasswordById(
      decryptToken,
      hashPassword,
    );
    if (!userOrError) {
      throw new BadRequestException('User not found');
    }
    const userIdEncrypted = await this.jwtAdapter.encrypt(userOrError.id);

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
