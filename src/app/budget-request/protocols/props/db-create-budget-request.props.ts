import { Status } from '@prisma/client';

export interface DbCreateBudgetRequestProps {
  id: string;
  amount: number;
  totalHours: number;
  status: Status;
  clientId: string;
}
