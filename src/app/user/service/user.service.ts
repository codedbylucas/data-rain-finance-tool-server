import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { BcryptAdapter } from 'src/app/infra/criptography/bcrypt/bcrypt.adapter';
import CryptrService from 'src/app/infra/criptography/cryptr/cryptr.adapter';
import { inviteRegisterPasswordTemplate } from 'src/app/infra/mail/email-template/invite-to-register-password.template';
import { MailService } from 'src/app/infra/mail/mail.service';
import { createUuid } from 'src/app/util/create-uuid';
import { UserEntity } from '../entities/user.entity';
import { FindUserResponse } from '../protocols/find-user-response';
import { ProfilePictureResponse } from '../protocols/profile-picture-response';
import { DbCreateUserDto } from '../repositories/dto/db-create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly mailService: MailService,
    private readonly cryptrService: CryptrService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<void> {
    const userOrNull: UserEntity | null =
      await this.userRepository.findUserByEmail(dto.email);
    if (userOrNull) {
      throw new BadRequestException(`User email already exists`);
    }

    const passwordRandom = `DataRain@${Math.random().toString(36).slice(-10)}`;
    const ecryptedPassword = await this.bcryptAdapter.hash(passwordRandom, 12);

    const data: DbCreateUserDto = {
      ...dto,
      id: createUuid(),
      password: ecryptedPassword,
    };

    const user = await this.userRepository.createUser(data);
    await this.sendEmails([user]);
  }

  async insertProfilePicture(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ProfilePictureResponse> {
    if (!file) {
      throw new BadRequestException('It is necessary to send a file');
    }
    const userOrNull = await this.userRepository.findUserById(userId);
    if (!userOrNull) {
      throw new BadRequestException(`User with id '${userId}' not found`);
    }

    const uploadDir = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'client',
      'profile-pictures',
      userId,
    );
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileDir = `${uploadDir}/${fileName}`;
    const fileBuffer = await sharp(file.buffer).resize(400, 400).toBuffer();
    writeFileSync(fileDir, fileBuffer);

    const userUpdated = await this.userRepository.insertProfilePicture({
      id: userOrNull.id,
      imageUrl: `/profile-pictures/${userId}/${fileName}`,
    });

    return {
      id: userUpdated.id,
      imageUrl: userUpdated.imageUrl,
    };
  }

  async findUserById(id: string): Promise<FindUserResponse> {
    const userOrNull = await this.userRepository.findUserById(id);
    if (!userOrNull) {
      throw new BadRequestException('User not found');
    }
    return userOrNull;
  }

  async findAllUsers(): Promise<FindUserResponse[]> {
    const usersOrNull = await this.userRepository.findAllUsers();
    if (!usersOrNull || usersOrNull.length === 0) {
      throw new BadRequestException('No user found');
    }
    return usersOrNull;
  }

  async updateOwnUser(id: string, dto: UpdateUserDto): Promise<void> {
    const userOrNull = await this.userRepository.findUserWithPaswordById(id);
    if (!userOrNull) {
      throw new BadRequestException(`User with id '${id}' not found`);
    }
    if (dto.currentPassword) {
      if (!dto.password && !dto.confirmPassword) {
        throw new BadRequestException(
          'It is necessary to inform the new password and confirm new password',
        );
      }
      this.verifyConfirmPassword(dto.password, dto.confirmPassword);

      const compare = await this.bcryptAdapter.compare(
        dto.currentPassword,
        userOrNull.password,
      );
      if (!compare) {
        throw new BadRequestException(
          'The password does not match the current password',
        );
      }

      const ecryptedPassword = await this.bcryptAdapter.hash(dto.password, 12);
      delete dto.currentPassword;
      delete dto.confirmPassword;
      const data = {
        ...dto,
        password: ecryptedPassword,
      };
      await this.userRepository.updateUserById(userOrNull.id, data);
      return;
    }
    await this.userRepository.updateUserById(userOrNull.id, dto);
  }

  async deleteUserById(id: string): Promise<void> {
    const userOrNull = await this.userRepository.findUserById(id);
    if (!userOrNull) {
      throw new BadRequestException(`User with id '${id}' not found`);
    }
    if (userOrNull.roleName === 'admin') {
      throw new BadRequestException(`Unable to perform this action`);
    }

    await this.userRepository.deleteUserById(id);
  }

  async sendEmails(users: UserEntity[]): Promise<void> {
    users.map(async (user) => {
      const tokenAuthentication = this.cryptrService.encrypt(user.id);

      const emailHtml = inviteRegisterPasswordTemplate({
        receiverName: user.name,
        token: tokenAuthentication,
      });

      await this.mailService.sendMail({
        to: user.email,
        subject: 'Crie uma nova senha',
        html: emailHtml,
      });
    });
  }

  verifyConfirmPassword(password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      throw new BadRequestException(
        `Password is different from confirm password`,
      );
    }
  }
}
