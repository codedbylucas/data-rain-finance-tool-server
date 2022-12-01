import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async createUser(data: CreateUserDto): Promise<UsersEntity> {
    const user: UsersEntity = this.userRepository.create(data);
    const savedUser: UsersEntity = await this.userRepository.save(user);

    return savedUser;
  }
}
