import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './service/dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    try {
      const createdUser: UserEntity = this.userRepository.create(data);
      const savedUser: UserEntity = await this.userRepository.save(createdUser);

      return savedUser;
    } catch (error) {
      throw new BadRequestException(
        'Error creating user, email already registered',
      );
    }
  }
}
