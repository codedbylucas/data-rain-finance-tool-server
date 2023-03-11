import { Module } from '@nestjs/common';
import { AdminNotificationModule } from './admin-notification/admin-notification.module';
import { ManagerNotificationModule } from './manager-notification/manager-notification.module';

@Module({
  imports: [ManagerNotificationModule, AdminNotificationModule],
})
export class UserNotificationModule {}
