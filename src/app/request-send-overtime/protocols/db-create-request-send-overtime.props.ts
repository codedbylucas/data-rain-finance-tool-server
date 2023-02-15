import { ApprovalStatus } from '@prisma/client';

export interface DbAskPermissionToSendOvertime {
  id: string;
  requestDescription: string;
  userProjectId: string;
  managerId: string;
  requestDate: string;
  dateToSendTime: string;
  approvalSatus: ApprovalStatus;
}
