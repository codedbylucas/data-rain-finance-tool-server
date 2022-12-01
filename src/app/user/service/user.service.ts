import { BadRequestException, Injectable } from '@nestjs/common';
import { Either, left, rigth } from 'src/app/shared/either/either';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    data: CreateUserDto,
  ): Promise<Either<BadRequestException, UserEntity>> {
    const user = await this.userRepository.findUserByEmail(data.email);
    if (user) {
      return left(new BadRequestException(`User email already exists`));
    }
    if (!this.verifyRole(data.role)) {
      return left(new BadRequestException(`Role '${data.role}' is invalid'`));
    }
    if (data.password !== data.confirmPassword) {
      return left(
        new BadRequestException(`Password is different from confirm password`),
      );
    }

    const createdUser = await this.userRepository.createUser(data);
    return rigth(createdUser);
  }

  verifyRole(role: string): boolean {
    if (role !== 'preSale' && role !== 'financial') {
      return false;
    }
    return true;
  }
}
