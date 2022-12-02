import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/app/user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<UnauthorizedException | UserEntity> {
    const userOrError = await this.authService.validateUser(email, password);
    if (userOrError.isLeft()) {
      throw userOrError.value;
    }
    return userOrError.value;
  }
}
