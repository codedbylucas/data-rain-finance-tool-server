import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserPayload } from '../protocols/user-payload';

export enum Role {
  admin, // 0
  financial, // 1
  preSale, // 2
  manager, // 3
  profissionalServices, // 4
}

export const RolesAccess = createParamDecorator(
  (roles: Role[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserPayload = request.user;
    if (!user) {
      throw new UnauthorizedException('User does not have permission');
    }
    if (!roles || roles.length === 0) {
      throw new InternalServerErrorException('Roles not informed');
    }

    const result = rolesName(roles);
    let count = 0;

    result.forEach((role) => {
      if (user.roles.includes(role)) {
        count++;
      }
    });
    if (count === 0) {
      throw new ForbiddenException(
        'User does not have permission to access this route',
      );
    }
    return user.userId;
  },
);

const rolesName = (roles: Role[]): string[] => {
  const rolesName = [];

  roles.forEach((role) => {
    if (role === 0) rolesName.push('admin');
    if (role === 1) rolesName.push('financial');
    if (role === 2) rolesName.push('preSale');
    if (role === 3) rolesName.push('manager');
    if (role === 4) rolesName.push('profissionalServices');
  });

  return rolesName;
};
