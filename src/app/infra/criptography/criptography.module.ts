import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BcryptAdapter } from './bcrypt/bcrypt.adapter';
import { JwtAdapter } from './jwt/jwt.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      privateKey: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '48h' },
    }),
  ],
  providers: [BcryptAdapter, JwtAdapter],
  exports: [BcryptAdapter, JwtAdapter],
})
export class CriptographyModule {}
