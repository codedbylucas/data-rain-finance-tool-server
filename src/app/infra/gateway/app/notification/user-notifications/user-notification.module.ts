import { Module } from '@nestjs/common';
import { ManagerNotificationModule } from './manager-notification/manager-notification.module';

@Module({
  imports: [ManagerNotificationModule],
})
export class UserNotificationModule {}
