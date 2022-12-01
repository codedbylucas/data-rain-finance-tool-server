import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    if (!this.verifyRole(data.role)) {
      throw new BadRequestException(`Role '${data.role}' is invalid'`);
    }

    const createdUser = await this.userRepository.createUser(data);

    return createdUser;
  }

  verifyRole(role: string): boolean {
    if (role !== 'preSale' && role !== 'financial') {
      return false;
    }
    return true;
  }
}
