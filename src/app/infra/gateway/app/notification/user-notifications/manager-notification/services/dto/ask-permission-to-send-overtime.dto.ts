import { DateToSendTimeEntity } from 'src/app/request-send-overtime/entities/date-to-send-time.entity';

export class AskPermissionToSendOvertimeDto {
  senderId: string;
  receiverId: string;
  dateToSendTime: DateToSendTimeEntity;
}
