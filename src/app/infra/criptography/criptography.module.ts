import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BcryptAdapter } from './bcrypt/bcrypt.adapter';
import CryptrService from './cryptr/cryptr.adapter';
import { JsonWebTokenAdapter } from './jwt/jsonwebtoken.adapter';
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
  providers: [BcryptAdapter, JwtAdapter, CryptrService, JsonWebTokenAdapter],
  exports: [BcryptAdapter, JwtAdapter, CryptrService, JsonWebTokenAdapter],
})
export class CriptographyModule {}
