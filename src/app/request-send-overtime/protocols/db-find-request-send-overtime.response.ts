import { ApprovalStatus } from '@prisma/client';

export interface DbRequestSendOvertimeResponse {
  id: string;
  requestDescription: string;
  approvalSatus: ApprovalStatus;
  dateToSendTime: {
    id: string;
    day: number;
    month: number;
    year: number;
  };
  userProject: {
    project: {
      name: string;
      description: string;
      client: {
        companyName: string;
      };
    };
    user: {
      name: string;
      email: string;
    };
  };
}
