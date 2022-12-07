import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { UserPayload } from '../protocols/user-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }
  async validate(payload: { userId: string }): Promise<UserPayload> {
    const userOrNull = await this.userRepository.findUserById(payload.userId);
    if (!userOrNull) {
      throw new UnauthorizedException('User not found or not authorized');
    }
    return {
      userId: payload.userId,
      role: userOrNull.role,
    };
  }
}
