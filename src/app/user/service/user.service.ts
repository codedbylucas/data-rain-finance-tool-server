import { BadRequestException, Injectable } from '@nestjs/common';
import { Either, left, rigth } from 'src/app/shared/either/either';
import { BcryptAdapter } from 'src/app/auth/criptography/bcrypt/bcrypt.adapter';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserCreatedResponse } from '../types/user-created-response.type';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserResponse } from '../types/find-user-response';
import { FindAllUsersResponse } from '../types/find-all-users-response';

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
    let formattedPhone = dto.phone.replace(/\s/g, '').replace(/[^0-9]/g, '');

    const ecryptedPassword = await this.bcryptAdapter.hash(dto.password, 12);
    const data = {
      ...dto,
      password: ecryptedPassword,
      phone: formattedPhone,
    };

    await this.userRepository.createUser(data);

    return rigth({
      statusCode: 201,
      message: 'User created successfully',
    });
  }

  async findUserById(
    id: string,
  ): Promise<Either<BadRequestException, FindUserResponse>> {
    const userOrNull = await this.userRepository.findUserById(id);
    if (!userOrNull) {
      return left(new BadRequestException('User not found'));
    }
    const userResponse = this.deleteSomeData(userOrNull);
    return rigth(userResponse);
  }

  async findAllUsers(): Promise<
    Either<BadRequestException, FindAllUsersResponse[]>
  > {
    const userOrNull = await this.userRepository.findAllUsers();
    if (!userOrNull || userOrNull.length === 0) {
      return left(new BadRequestException('No user found'));
    }

    const users = userOrNull.map((user) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };
    });

    return rigth(users);
  }

  verifyRole(role: string): boolean {
    if (role !== 'preSale' && role !== 'financial') {
      return false;
    }
    return true;
  }

  deleteSomeData(user: UserEntity): FindUserResponse {
    delete user.createdAt;
    delete user.updatedAt;
    delete user.deletedAt;
    delete user.password;
    return user;
  }
}
