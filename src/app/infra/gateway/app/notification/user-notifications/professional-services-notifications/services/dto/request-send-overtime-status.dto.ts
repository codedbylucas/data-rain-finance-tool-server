import { DateToSendTimeEntity } from 'src/app/request-send-overtime/entities/date-to-send-time.entity';

export class RequestSendOvertimeStatusDto {
  senderId: string;
  receiverId: string;
  dateToSendTime: DateToSendTimeEntity;
  approved: boolean;
  projectId: string;
}
