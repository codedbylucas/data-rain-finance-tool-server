import { Status } from '@prisma/client';

export interface DbFindAllBudgetRequestsResponse {
  id: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: string;
    companyName: string;
    mainContact: string;
  };
}
