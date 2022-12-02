import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/app/user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), PassportModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
