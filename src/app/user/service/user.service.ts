import { BadRequestException, Injectable } from '@nestjs/common';
import { BcryptAdapter } from 'src/app/auth/criptography/bcrypt/bcrypt.adapter';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { FindAllUsersResponse } from '../types/find-all-users-response';
import { FindUserResponse } from '../types/find-user-response';
import { UpdateUserResponse } from '../types/update-user-response.type';
import { UserCreatedResponse } from '../types/user-created-response.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserCreatedResponse> {
    const userOrNull: UserEntity | null =
      await this.userRepository.findUserByEmail(dto.email);
    if (userOrNull) {
      throw new BadRequestException(`User email already exists`);
    }
    if (!this.verifyRole(dto.role)) {
      throw new BadRequestException(`Role '${dto.role}' is invalid'`);
    }
    this.verifyConfirmPassword(dto.password, dto.confirmPassword);

    let formattedPhone = dto.phone.replace(/\s/g, '').replace(/[^0-9]/g, '');

    const ecryptedPassword = await this.bcryptAdapter.hash(dto.password, 12);
    const data = {
      ...dto,
      password: ecryptedPassword,
      phone: formattedPhone,
    };

    await this.userRepository.createUser(data);

    return {
      statusCode: 201,
      message: 'User created successfully',
    };
  }

  async findUserById(id: string): Promise<FindUserResponse> {
    const userOrNull = await this.userRepository.findUserById(id);
    if (!userOrNull) {
      throw new BadRequestException('User not found');
    }
    const userResponse = this.deleteSomeData(userOrNull);
    return userResponse;
  }

  async findAllUsers(): Promise<FindAllUsersResponse[]> {
    const userOrNull = await this.userRepository.findAllUsers();
    if (!userOrNull || userOrNull.length === 0) {
      throw new BadRequestException('No user found');
    }

    const users = userOrNull.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }));

    return users;
  }

  async updateUserSelfById(id: string, dto: UpdateUserDto): Promise<void> {
    const userOrNull = await this.userRepository.findUserById(id);
    if (!userOrNull) {
      throw new BadRequestException(`User with id '${id}' not found`);
    }
    if (dto.currentPassword) {
      if (dto.password && dto.confirmPassword) {
        this.verifyConfirmPassword(dto.password, dto.confirmPassword);
      } else {
        throw new BadRequestException(
          'It is necessary to inform the new password and confirm new password',
        );
      }
      const compare = await this.bcryptAdapter.compare(
        dto.currentPassword,
        userOrNull.password,
      );
      if (!compare) {
        throw new BadRequestException(
          'The password does not match the current password',
        );
      }
      const ecryptedPassword = await this.bcryptAdapter.hash(dto.password, 12);
      delete dto.currentPassword;
      delete dto.confirmPassword;
      const data = {
        ...dto,
        password: ecryptedPassword,
      };
      await this.userRepository.updateUserById(userOrNull, data);
      return;
    }

    await this.userRepository.updateUserById(userOrNull, dto);
  }

  async deleteUserById(id: string): Promise<void> {
    const userOrNull = await this.userRepository.findUserById(id);
    if (!userOrNull) {
      throw new BadRequestException(`User with id '${id}' not found`);
    }
    if (userOrNull.role === 'admin') {
      throw new BadRequestException('Action not allowed');
    }
    await this.userRepository.deleteUserById(id);
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

  verifyConfirmPassword(password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      throw new BadRequestException(
        `Password is different from confirm password`,
      );
    }
  }
}
