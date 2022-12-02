import { BadRequestException, Injectable } from '@nestjs/common';
import { Either, left, rigth } from 'src/app/shared/either/either';
import { BcryptAdapter } from 'src/app/auth/criptography/bcrypt/bcrypt.adapter';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserCreatedResponse } from '../types/user-created-response.type';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
  ) {}

  async createUser(
    dto: CreateUserDto,
  ): Promise<Either<BadRequestException, UserCreatedResponse>> {
    const userOrNull: UserEntity | null =
      await this.userRepository.findUserByEmail(dto.email);
    if (userOrNull) {
      return left(new BadRequestException(`User email already exists`));
    }
    if (!this.verifyRole(dto.role)) {
      return left(new BadRequestException(`Role '${dto.role}' is invalid'`));
    }
    if (dto.password !== dto.confirmPassword) {
      return left(
        new BadRequestException(`Password is different from confirm password`),
      );
    }

    const ecryptedPassword = await this.bcryptAdapter.hash(dto.password, 12);
    const data = {
      ...dto,
      password: ecryptedPassword,
    };

    await this.userRepository.createUser(data);

    return rigth({
      statusCode: 201,
      message: 'User created successfully',
    });
  }

  verifyRole(role: string): boolean {
    if (role !== 'preSale' && role !== 'financial') {
      return false;
    }
    return true;
  }
}
