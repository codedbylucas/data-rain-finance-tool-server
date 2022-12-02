import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/app/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from './criptography/bcrypt/bcrypt.service';
import { JwtAdapter } from './criptography/jwt/jwt.adapter';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    UserModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '48h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    BcryptService,
    JwtAdapter,
    JwtStrategy,
  ],
})
export class AuthModule {}
