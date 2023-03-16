import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GatewayModule } from '../../gateway.module';
import { GatewayService } from '../../services/gateway.service';
import { NotificationControlelr } from './notification.controller';
import { NotificationEmitter } from './notification.emitter';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './service/notification.service';
import { UserNotificationModule } from './user-notifications/user-notification.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UserNotificationModule,
    forwardRef(() => GatewayModule),
  ],
  controllers: [NotificationControlelr],
  providers: [NotificationRepository, NotificationService, NotificationEmitter],
  exports: [NotificationService, NotificationEmitter],
})
export class NotificationModule implements OnModuleInit {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly notificationService: NotificationService,
  ) {}

  onModuleInit() {
    this.gatewayService.setNotificationService(this.notificationService);
  }
}
