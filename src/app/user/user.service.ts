import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async createUser(data: CreateUserDto): Promise<UsersEntity> {
    if (!this.verifyRole(data.role)) {
      throw new BadRequestException(`Role '${data.role}' is invalid`);
    }
    const user: UsersEntity = this.userRepository.create(data);
    const savedUser: UsersEntity = await this.userRepository.save(user);

    return savedUser;
  }

  verifyRole(role: string): boolean {
    if (role !== 'preSale' && role !== 'financial') {
      return false;
    }
    return true;
  }
}
