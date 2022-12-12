import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserPayload } from '../protocols/user-payload';

export const LoggedUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserPayload = request.user;
    if (!user) {
      throw new UnauthorizedException('User does not have permission');
    }
    return user.userId;
  },
);
