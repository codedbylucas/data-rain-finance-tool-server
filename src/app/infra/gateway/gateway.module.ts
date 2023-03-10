import { Module } from '@nestjs/common';
import { CriptographyModule } from '../criptography/criptography.module';
import { GatewayController } from './controllers/gateway.controller';
import { NotificationModule } from './app/notification/notification.module';
import { GatewayRepository } from './repositories/gateway.repository';
import { GatewayService } from './services/gateway.service';

@Module({
  imports: [NotificationModule, CriptographyModule],
  providers: [GatewayController, GatewayService, GatewayRepository],
  exports: [GatewayService, GatewayController],
})
export class GatewayModule {}
