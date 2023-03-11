import { DateToSendTimeEntity } from 'src/app/request-send-overtime/entities/date-to-send-time.entity';

export class AskPermissionToSendOvertimeForAdminDto {
  senderId: string;
  dateToSendTime: DateToSendTimeEntity;
}
