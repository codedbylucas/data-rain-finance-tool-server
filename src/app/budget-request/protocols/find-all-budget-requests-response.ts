import { Status } from '@prisma/client';

export interface FindAllBudgetRequestsResponse {
  id: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    companyName: string;
    primaryContactName: string;
  };
}
