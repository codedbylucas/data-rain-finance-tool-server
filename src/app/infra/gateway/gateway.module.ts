import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { GatewayRepository } from './repositories/gateway.repository';
import { GatewayService } from './services/gateway.service';

@Module({
  imports: [NotificationsModule],
  providers: [GatewayController, GatewayService, GatewayRepository],
})
export class GatewayModule {}
