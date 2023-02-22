import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import CryptrService from 'src/app/infra/criptography/cryptr/cryptr.adapter';
import { JsonWebTokenAdapter } from 'src/app/infra/criptography/jwt/jsonwebtoken.adapter';
import { FindAllUserDataResponse } from 'src/app/user/protocols/db-find-all-user-data.response';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { BcryptAdapter } from '../../infra/criptography/bcrypt/bcrypt.adapter';
import { JwtAdapter } from '../../infra/criptography/jwt/jwt.adapter';
import { LoginResponse } from '../protocols/login-response';
import { FirstAccessDto } from './dto/first-access.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter,
    private readonly cryptr: CryptrService,
    private readonly jsonWebTokenAdapter: JsonWebTokenAdapter,
  ) {}

  async validateUser(dto: LoginDto): Promise<FindAllUserDataResponse> {
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
    return this.returnUserLogged(userIdEncrypted, userOrError);
  }

  async firstAccess(
    token: string,
    dto: FirstAccessDto,
  ): Promise<LoginResponse> {
    const decryptToken = this.cryptr.decrypt(token);
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(
        `Password is different from confirm password`,
      );
    }
    const userOrError = await this.userRepository.findAllUserDataById(
      decryptToken,
    );
    if (!userOrError) {
      throw new BadRequestException('User not found');
    }
    if (userOrError.validatedEmail) {
      throw new BadRequestException('User already validated');
    }

    const hashedPassword = await this.bcryptAdapter.hash(dto.password, 12);
    await this.userRepository.updateUserFirstAccesById({
      id: userOrError.id,
      password: hashedPassword,
      validatedEmail: true,
    });

    const userIdEncrypted = await this.jwtAdapter.encrypt(userOrError.id);
    return this.returnUserLogged(userIdEncrypted, userOrError);
  }

  async passwordRecovery(
    token: string,
    dto: PasswordRecoveryDto,
  ): Promise<LoginResponse> {
    const decryptToken = this.jsonWebTokenAdapter.verifyToken(token);
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(
        `Password is different from confirm password`,
      );
    }

    const userOrError = await this.userRepository.findAllUserDataById(
      decryptToken.userId,
    );
    if (!userOrError) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await this.bcryptAdapter.hash(dto.password, 12);
    if (!userOrError.validatedEmail) {
      await this.userRepository.updateUserFirstAccesById({
        id: userOrError.id,
        password: hashedPassword,
        validatedEmail: true,
      });
    } else {
      await this.userRepository.updateOwnUser(userOrError.id, {
        password: hashedPassword,
      });
    }

    const userIdEncrypted = await this.jwtAdapter.encrypt(userOrError.id);
    return this.returnUserLogged(userIdEncrypted, userOrError);
  }

  returnUserLogged(
    userIdEncrypted: string,
    user: FindAllUserDataResponse,
  ): LoginResponse {
    return {
      token: userIdEncrypted,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        billable: user.billable,
        allocated: user.allocated,
        role: { name: user.role.name },
        position: { name: user.position.name },
      },
    };
  }
}
