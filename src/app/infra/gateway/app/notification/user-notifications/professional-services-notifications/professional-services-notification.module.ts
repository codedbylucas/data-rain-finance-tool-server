import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/app/user/user.module';
import { NotificationModule } from '../../notification.module';
import { ProfessionalServicesNotificationService } from './services/professional-services-notification.service';

@Module({
  imports: [UserModule, forwardRef(() => NotificationModule)],
  providers: [ProfessionalServicesNotificationService],
  exports: [ProfessionalServicesNotificationService],
})
export class ProfessionalServicesNotificationModule {}
