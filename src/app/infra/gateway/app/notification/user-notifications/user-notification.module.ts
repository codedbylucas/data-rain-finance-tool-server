import { Module } from '@nestjs/common';
import { AdminNotificationModule } from './admin-notification/admin-notification.module';
import { ManagerNotificationModule } from './manager-notification/manager-notification.module';
import { ProfessionalServicesNotificationModule } from './professional-services-notifications/professional-services-notification.module';

@Module({
  imports: [
    ManagerNotificationModule,
    AdminNotificationModule,
    ProfessionalServicesNotificationModule,
  ],
})
export class UserNotificationModule {}
