import { DateToSendTimeEntity } from '../entities/date-to-send-time.entity';

export interface ChangeStatusOfRequestSendOvertimeResponse {
  projectId: string;
  userId: string;
  dateToSendTime: DateToSendTimeEntity;
}
