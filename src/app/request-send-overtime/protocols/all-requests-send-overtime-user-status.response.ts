import { ApprovalStatus } from '@prisma/client';

export interface AllRequestSendOvertimeUserStatusResponse {
  id: string;
  dateToSendTime: string;
  status: ApprovalStatus;
}
