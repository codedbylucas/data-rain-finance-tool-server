import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/app/user/user.module';
import { NotificationModule } from '../../notification.module';
import { ManagerNotificationService } from './services/manager-notification.service';

@Module({
  imports: [UserModule, forwardRef(() => NotificationModule)],
  providers: [ManagerNotificationService],
  exports: [ManagerNotificationService],
})
export class ManagerNotificationModule {}
