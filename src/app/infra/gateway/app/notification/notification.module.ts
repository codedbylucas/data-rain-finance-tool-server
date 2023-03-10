import { forwardRef, Module } from '@nestjs/common';
import { GatewayModule } from '../../gateway.module';
import { NotificationEmitter } from './notification.emitter';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './service/notification.service';
import { UserNotificationModule } from './user-notifications/user-notification.module';

@Module({
  imports: [UserNotificationModule, forwardRef(() => GatewayModule)],
  providers: [NotificationRepository, NotificationService, NotificationEmitter],
  exports: [NotificationService, NotificationEmitter],
})
export class NotificationModule {}
