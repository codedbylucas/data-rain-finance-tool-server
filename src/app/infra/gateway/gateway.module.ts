import { Module } from '@nestjs/common';
import { CriptographyModule } from '../criptography/criptography.module';
import { GatewayController } from './controllers/gateway.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { GatewayRepository } from './repositories/gateway.repository';
import { GatewayService } from './services/gateway.service';

@Module({
  imports: [NotificationsModule, CriptographyModule],
  providers: [GatewayController, GatewayService, GatewayRepository],
})
export class GatewayModule {}
