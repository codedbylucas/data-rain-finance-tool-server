import { ApprovalStatus } from '@prisma/client';

export interface ChangeStatusOfRequestSendOvertimeProps {
  approvalSatus: ApprovalStatus;
  validationDate: Date;
  validatedByUserId: string;
}
