import { Module } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './service/notification.service';

@Module({
  providers: [NotificationRepository, NotificationService],
})
export class NotificationModule {}
