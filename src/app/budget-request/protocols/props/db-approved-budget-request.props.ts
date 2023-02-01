import { Status } from '@prisma/client';

export interface DbAprrovedByPreSaleBudgetRequestProps {
  budgetRequestId: string;
  verifyByPreSaleId?: string;
  verifyByFinancialId?: string;
  status: Status;
}
