import { forwardRef, Module } from '@nestjs/common';
import { GatewayModule } from '../../gateway.module';
import { GatewayService } from '../../services/gateway.service';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './service/notification.service';
import { UserNotificationModule } from './user-notifications/user-notification.module';

@Module({
  imports: [UserNotificationModule, forwardRef(() => GatewayModule)],
  providers: [NotificationRepository, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
