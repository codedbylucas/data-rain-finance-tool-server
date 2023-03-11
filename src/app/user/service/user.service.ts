import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { BcryptAdapter } from 'src/app/infra/criptography/bcrypt/bcrypt.adapter';
import CryptrService from 'src/app/infra/criptography/cryptr/cryptr.adapter';
import { JsonWebTokenAdapter } from 'src/app/infra/criptography/jwt/jsonwebtoken.adapter';
import { invitePasswordRecoveryTemplate } from 'src/app/infra/mail/email-template/invite-to-password-recovery-template';
import { inviteRegisterPasswordTemplate } from 'src/app/infra/mail/email-template/invite-to-register-password.template';
import { MailService } from 'src/app/infra/mail/mail.service';
import { PositionService } from 'src/app/position/services/position.service';
import { RoleService } from 'src/app/role/service/role.service';
import { createUuid } from 'src/app/util/create-uuid';
import { UserEntity } from '../entities/user.entity';
import { AdminIds } from '../protocols/admin-ids.response';
import { FindAllUserDataResponse } from '../protocols/db-find-all-user-data.response';
import { DbFindManyUsersByQueryParam } from '../protocols/db-find-many-manger.response';
import { FindaManyUsersByQueryParamResponse } from '../protocols/find-many-users-by-query-param.response';
import { FindUserResponse } from '../protocols/find-user-response';
import { ProfilePictureResponse } from '../protocols/profile-picture-response';
import { DbCreateUserProps } from '../protocols/props/db-create-user.props';
import { SendEmailProps } from '../protocols/props/send-email.props';
import { UpdateUserAllocatedProps } from '../protocols/props/updte-user-allocated-props';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateOwnUserDto } from './dto/update-own-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPasswordRecoveryDto } from './dto/user-password-recovery.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly mailService: MailService,
    private readonly cryptrService: CryptrService,
    private readonly roleService: RoleService,
    private readonly positionService: PositionService,
    private readonly jsonWebTokenAdapter: JsonWebTokenAdapter,
  ) {}

  async createUser(dto: CreateUserDto): Promise<void> {
    const userOrNull: FindAllUserDataResponse | null =
      await this.userRepository.findUserByEmail(dto.email);
    if (userOrNull) {
      throw new BadRequestException(`User email already exists`);
    }
    await this.roleService.findRoleById(dto.roleId);
    await this.positionService.findPositionById(dto.positionId);

    const passwordRandom = `DataRain@${Math.random().toString(36).slice(-10)}`;
    const hashedPassword = await this.bcryptAdapter.hash(passwordRandom, 12);

    const data: DbCreateUserProps = {
      ...dto,
      id: createUuid(),
      password: hashedPassword,
    };

    const user = await this.userRepository.createUser(data);

    const tokenAuthentication = this.cryptrService.encrypt(user.id);
    const emailHtml = inviteRegisterPasswordTemplate({
      receiverName: user.name,
      token: tokenAuthentication,
    });
    await this.sendEmailToCreateNewPassword({
      email: user.email,
      emailHtml,
    });
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

  async passwordRecovery(dto: UserPasswordRecoveryDto): Promise<void> {
    const userOrNull = await this.userRepository.findUserByEmail(dto.email);

    if (!userOrNull) {
      throw new BadRequestException(`User with email '${dto.email}' not found`);
    }

    const tokenAuthentication = this.jsonWebTokenAdapter.generateToken({
      userId: userOrNull.id,
    });
    const emailHtml = invitePasswordRecoveryTemplate({
      receiverName: userOrNull.name,
      token: tokenAuthentication.token,
    });

    await this.sendEmailToCreateNewPassword({
      email: userOrNull.email,
      emailHtml,
    });
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

  async updateOwnUser(id: string, dto: UpdateOwnUserDto): Promise<void> {
    const userOrNull = await this.userRepository.findAllUserDataById(id);
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

      const hashedPassword = await this.bcryptAdapter.hash(dto.password, 12);
      delete dto.currentPassword;
      delete dto.confirmPassword;
      const data = {
        ...dto,
        password: hashedPassword,
      };
      await this.userRepository.updateOwnUser(userOrNull.id, data);
      return;
    }
    await this.userRepository.updateOwnUser(userOrNull.id, dto);
  }

  async deleteUserById(id: string): Promise<void> {
    const userOrNull = await this.userRepository.findUserById(id);
    if (!userOrNull) {
      throw new BadRequestException(`User with id '${id}' not found`);
    }
    if (userOrNull.role.name === 'admin') {
      throw new BadRequestException(`Unable to perform this action`);
    }

    await this.userRepository.deleteUserById(id);
  }

  async updateUserById(id: string, dto: UpdateUserDto) {
    if (!dto.roleId && (dto.billable === null || dto.billable === undefined)) {
      throw new BadRequestException(`Role Id or billable must be informed`);
    }
    await this.findUserById(id);
    if (dto.roleId) {
      const roleOrNull = await this.roleService.findRoleById(dto.roleId);
      if (roleOrNull) {
        if (roleOrNull.name === 'admin') {
          throw new BadRequestException(`Invalid operation`);
        }
      }
    }

    const roleAddedToUser = await this.userRepository.updateUserById(id, dto);
    return roleAddedToUser;
  }

  async findAllAdminIds(): Promise<AdminIds[]> {
    const usersOrEmpty = await this.userRepository.findAllAdminIds();
    if (usersOrEmpty.length === 0) {
      throw new NotFoundException(`No Admin found`);
    }
    return usersOrEmpty;
  }

  async updateUserAllocated(
    props: UpdateUserAllocatedProps,
  ): Promise<UserEntity> {
    const userUpdated = await this.userRepository.updateUserAllocated(props);
    return userUpdated;
  }

  async findaManyUsersByQueryParam(
    data: string,
    roleName: string,
  ): Promise<FindaManyUsersByQueryParamResponse> {
    if (!data) {
      throw new BadRequestException(`Parameter not informed`);
    }
    let usersByNameAndEmail: DbFindManyUsersByQueryParam = null;

    if (roleName === 'manager') {
      usersByNameAndEmail = await this.userRepository.findManyUsersByQueryParam(
        data,
        'manager',
      );
    }
    if (roleName === 'professional services') {
      usersByNameAndEmail = await this.userRepository.findManyUsersByQueryParam(
        data,
        'professional services',
      );
    }

    const usersByNameIds = usersByNameAndEmail.usersByNameOrEmpty.map(
      (user) => user.id,
    );

    if (usersByNameIds.length > 0) {
      for (const id of usersByNameIds) {
        let index: number = null;
        for (
          let i = 0;
          i < usersByNameAndEmail.usersByEmailOrEmpty.length;
          i++
        ) {
          let userExist = null;
          if (usersByNameAndEmail?.usersByEmailOrEmpty[i].id === id) {
            index = i;
            userExist = usersByNameAndEmail.usersByEmailOrEmpty[i];
          }
          if (userExist) {
            usersByNameAndEmail.usersByEmailOrEmpty.splice(index, 1);
          }
        }
      }
    }

    let users = [];
    for (let user of usersByNameAndEmail?.usersByNameOrEmpty) {
      users.push(user);
    }
    for (let user of usersByNameAndEmail?.usersByEmailOrEmpty) {
      users.push(user);
    }

    if (users.length === 0) {
      throw new NotFoundException(`None a user manager starts with '${data}'`);
    }

    return { users };
  }

  async sendEmailToCreateNewPassword(props: SendEmailProps): Promise<void> {
    await this.mailService.sendMail({
      to: props.email,
      subject: 'Crie uma nova senha',
      html: props.emailHtml,
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
