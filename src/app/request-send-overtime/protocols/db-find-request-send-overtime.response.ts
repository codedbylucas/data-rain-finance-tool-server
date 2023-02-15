import { ApprovalStatus } from '@prisma/client';

export interface DbRequestSendOvertimeResponse {
  id: string;
  requestDescription: string;
  approvalSatus: ApprovalStatus;
  dateToSendTime: string;
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
