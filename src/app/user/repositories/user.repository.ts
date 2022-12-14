import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { UserEntity } from '../entities/user.entity';
import { FindAllUsersResponse } from '../protocols/find-all-users-response';
import { ProfilePictureDto } from '../service/dto/insert-profile-picture.dto';
import { UpdateUserDto } from '../service/dto/update-user.dto';
import { DbCreateUserDto } from './dto/db-create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: DbCreateUserDto): Promise<UserEntity> {
    const createdUser = await this.prisma.users
      .create({ data })
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

  async findUserById(id: string): Promise<UserEntity> {
    const user = await this.prisma.users
      .findUnique({ where: { id } })
      .catch(serverError);
    return user;
  }

  async findUserRolesByUserId(id: string) {
    const userRoles = await this.prisma.usersRoles
      .findMany({
        where: { userId: id },
        select: {
          role: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      })
      .catch(serverError);
    return userRoles;
  }

  async findAllUsers(): Promise<FindAllUsersResponse[]> {
    const users = await this.prisma.users
      .findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
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

  async deleteUserById(id: string): Promise<void> {
    await this.prisma.users.delete({ where: { id } }).catch(serverError);
  }
}
