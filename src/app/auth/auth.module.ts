import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/app/user/user.module';
import { AuthController } from './auth.controller';
import { BcryptAdapter } from './criptography/bcrypt/bcrypt.adapter';
import { JwtAdapter } from './criptography/jwt/jwt.adapter';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UserModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '48h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptAdapter, JwtAdapter, JwtStrategy],
})
export class AuthModule {}
