import { ApprovalStatus } from '@prisma/client';

export interface DbAskPermissionToSendOvertime {
  id: string;
  requestDescription: string;
  userProjectId: string;
  managerId: string;
  requestDate: string;
  approvalSatus: ApprovalStatus;
  dateToSendTime: {
    id: string;
    day: number;
    month: number;
    year: number;
  };
}
