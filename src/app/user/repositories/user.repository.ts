import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateUserFirstAccesProps } from 'src/app/auth/protocols/props/update-user-first-access.props';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { UserEntity } from '../entities/user.entity';
import { DbFindManyUsersByQueryParam } from '../protocols/db-find-many-manger.response';
import { FindUserResponse } from '../protocols/find-user-response';
import { DbCreateUserProps } from '../protocols/props/db-create-user.props';
import { ProfilePictureProps } from '../protocols/props/insert-profile-picture.props';
import { UpdateUserAllocatedProps } from '../protocols/props/updte-user-allocated-props';
import { UpdateOwnUserDto } from '../service/dto/update-own-user.dto';
import { UpdateUserDto } from '../service/dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: DbCreateUserProps): Promise<UserEntity> {
    const user: Prisma.UsersCreateInput = {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      position: {
        connect: {
          id: data.positionId,
        },
      },
      billable: data.billable,
      role: {
        connect: {
          id: data.roleId,
        },
      },
    };
    const createdUser = await this.prisma.users
      .create({ data: user })
      .catch(serverError);

    return createdUser;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.users
      .findUnique({ where: { email } })
      .catch(serverError);
    return user;
  }

  async insertProfilePicture(
    profilePictureDto: ProfilePictureProps,
  ): Promise<UserEntity> {
    const userUpdated = await this.prisma.users
      .update({
        where: { id: profilePictureDto.id },
        data: { imageUrl: profilePictureDto.imageUrl },
      })
      .catch(serverError);
    return userUpdated;
  }

  async findUserById(id: string): Promise<FindUserResponse> {
    const user = await this.prisma.users
      .findUnique({
        where: { id },
        select: this.findUserSelect,
      })
      .catch(serverError);
    return user;
  }

  async findUserEntityById(id: string): Promise<UserEntity> {
    const user = await this.prisma.users
      .findUnique({
        where: { id },
      })
      .catch(serverError);
    return user;
  }

  async findAllUsers(): Promise<FindUserResponse[]> {
    const users = await this.prisma.users
      .findMany({
        select: this.findUserSelect,
      })
      .catch(serverError);
    return users;
  }

  async updateOwnUser(id: string, data: UpdateOwnUserDto): Promise<UserEntity> {
    const userUpdated = await this.prisma.users
      .update({
        where: { id },
        data,
      })
      .catch(serverError);
    return userUpdated;
  }

  async updateUserAllocated(
    props: UpdateUserAllocatedProps,
  ): Promise<UserEntity> {
    const userUpdated = await this.prisma.users
      .update({
        where: { id: props.id },
        data: {
          allocated: props.allocated,
        },
      })
      .catch(serverError);
    return userUpdated;
  }

  async updateUserFirstAccesById(
    props: UpdateUserFirstAccesProps,
  ): Promise<UserEntity> {
    const userUpdated = await this.prisma.users
      .update({
        where: { id: props.id },
        data: {
          password: props.password,
          validatedEmail: props.validatedEmail,
        },
      })
      .catch(serverError);
    return userUpdated;
  }

  async deleteUserById(id: string): Promise<void> {
    await this.prisma.users.delete({ where: { id } }).catch(serverError);
  }

  async updateUserById(id: string, dto: UpdateUserDto): Promise<void> {
    let data: Prisma.UsersUpdateInput = this.createUpdateData(dto);

    await this.prisma.users
      .update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          billable: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      .catch(serverError);
  }

  createUpdateData(dto: UpdateUserDto): Prisma.UsersUpdateInput {
    let data: Prisma.UsersUpdateInput = {};
    if (dto.roleId && (dto.billable || !dto.billable)) {
      data = {
        billable: dto.billable,
        role: {
          connect: {
            id: dto.roleId,
          },
        },
      };
    } else if (dto.roleId) {
      data = {
        role: {
          connect: {
            id: dto.roleId,
          },
        },
      };
    } else {
      data = {
        billable: dto.billable,
      };
    }

    return data;
  }

  async findManyUsersByQueryParam(
    data: string,
    roleName: string,
  ): Promise<DbFindManyUsersByQueryParam> {
    const usersByNameOrEmpty = await this.prisma.users
      .findMany({
        where: {
          name: {
            startsWith: data,
            mode: 'insensitive',
          },
          AND: {
            roleName,
          },
        },

        select: {
          id: true,
          name: true,
          email: true,
        },
      })
      .catch(serverError);

    const usersByEmailOrEmpty = await this.prisma.users
      .findMany({
        where: {
          email: {
            startsWith: data,
            mode: 'insensitive',
          },
          AND: {
            roleName,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })
      .catch(serverError);

    const users = {
      usersByNameOrEmpty,
      usersByEmailOrEmpty,
    };

    return users;
  }

  private readonly findUserSelect = {
    id: true,
    name: true,
    email: true,
    imageUrl: true,
    billable: true,
    allocated: true,
    positionName: true,
    roleName: true,
  };
}
