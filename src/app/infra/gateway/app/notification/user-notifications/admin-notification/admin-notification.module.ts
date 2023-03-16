import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/app/user/user.module';
import { NotificationModule } from '../../notification.module';
import { AdminNotificationService } from './services/admin-notification.service';

@Module({
  imports: [UserModule, forwardRef(() => NotificationModule)],
  providers: [AdminNotificationService],
  exports: [AdminNotificationService],
})
export class AdminNotificationModule {}
