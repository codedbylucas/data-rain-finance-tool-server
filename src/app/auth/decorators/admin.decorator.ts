import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserPayload } from '../protocols/user-payload';

export const PermissionAdmin = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserPayload = request.user;
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'User does not have permission to access this route',
      );
    }
    return user;
  },
);
