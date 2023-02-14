import { ApprovalStatus } from '@prisma/client';

export interface FindRequestSendOvertimeResponse {
  requestSendOvertimeId: string;
  requestDescription: string;
  approvalSatus: ApprovalStatus;
  project: {
    name: string;
    description: string;
  };
  client: {
    companyName: string;
  };
  user: {
    name: string;
    email: string;
  };
}
