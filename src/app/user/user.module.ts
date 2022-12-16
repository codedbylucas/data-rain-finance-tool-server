import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BcryptAdapter } from 'src/app/infra/criptography/bcrypt/bcrypt.adapter';
import { MailModule } from '../infra/mail/mail.module';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PrismaModule,
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, BcryptAdapter],
  exports: [UserRepository],
})
export class UserModule {}
