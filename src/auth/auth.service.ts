import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Either, left, rigth } from 'src/app/shared/either/either';
import { UserEntity } from 'src/app/user/entities/user.entity';
import { UserRepository } from 'src/app/user/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Either<UnauthorizedException, UserEntity>> {
    const userOrNull = await this.userRepository.findUserByEmail(email);
    if (!userOrNull) {
      return left(new UnauthorizedException('Invalid email and/or password!'));
    }

    const isPasswordValid = bcrypt.compareSync(password, userOrNull.password);
    if (!isPasswordValid) {
      return left(new UnauthorizedException('Invalid email and/or password!'));
    }

    return rigth(userOrNull);
  }
}
