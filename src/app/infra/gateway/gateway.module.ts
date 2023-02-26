import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [NotificationsModule],
  providers: [GatewayController],
})
export class GatewayModule {}
