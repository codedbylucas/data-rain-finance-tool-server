import { ApprovalStatus } from '@prisma/client';

export interface AllRequestSendOvertimeUserStatusResponse {
  id: string;
  requestDescription: string;
  dateToSendTime: string;
  status: ApprovalStatus;
}
