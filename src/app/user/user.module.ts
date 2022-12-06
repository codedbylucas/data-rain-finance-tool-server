import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptAdapter } from 'src/app/auth/criptography/bcrypt/bcrypt.adapter';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, BcryptAdapter],
  exports: [UserRepository],
})
export class UserModule {}
