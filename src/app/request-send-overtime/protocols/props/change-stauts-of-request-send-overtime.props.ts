import { ApprovalStatus } from '@prisma/client';

export interface ChangeStatusOfRequestSendOvertimeProps {
  approvalSatus: ApprovalStatus;
  authorizationDate?: Date;
  disapprovalDate?: Date;
}
