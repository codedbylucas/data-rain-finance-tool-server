import { Module } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './service/notification.service';
import { UserNotificationModule } from './user-notifications/user-notification.module';

@Module({
  imports: [UserNotificationModule],
  providers: [NotificationRepository, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
