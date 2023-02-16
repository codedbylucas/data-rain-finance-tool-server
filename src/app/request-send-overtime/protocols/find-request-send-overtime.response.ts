import { ApprovalStatus } from '@prisma/client';

export interface FindRequestSendOvertimeResponse {
  requestSendOvertimeId: string;
  requestDescription: string;
  dateToSendTime: {
    id: string;
    day: number;
    month: number;
    year: number;
  };
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
