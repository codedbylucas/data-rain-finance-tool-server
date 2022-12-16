import { Module } from '@nestjs/common';
import { UserModule } from 'src/app/user/user.module';
import { CriptographyModule } from '../infra/criptography/criptography.module';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UserModule, CriptographyModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
