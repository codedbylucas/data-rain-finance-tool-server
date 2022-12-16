import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateUserFirstAccesProps } from 'src/app/auth/protocols/props/update-user-first-access.props';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { UserEntity } from '../entities/user.entity';
import { FindUserResponse } from '../protocols/find-user-response';
import { ProfilePictureDto } from '../service/dto/insert-profile-picture.dto';
import { UpdateUserDto } from '../service/dto/update-user.dto';
import { DbCreateUserDto } from './dto/db-create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: DbCreateUserDto): Promise<UserEntity> {
    const user: Prisma.UsersCreateInput = {
      ...data,
      role: {
        connect: {
          name: 'profissional_services',
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
    profilePictureDto: ProfilePictureDto,
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

  async updateUserById(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const userUpdated = await this.prisma.users
      .update({
        where: { id },
        data,
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

  private readonly findUserSelect = {
    id: true,
    name: true,
    email: true,
    imageUrl: true,
    billable: true,
    allocated: true,
    position: true,
    roleName: true,
  };
}
