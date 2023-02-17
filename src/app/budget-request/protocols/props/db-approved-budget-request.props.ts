import { Status } from '@prisma/client';

export interface DbAprrovedByPreSaleBudgetRequestProps {
  verifyByPreSaleId?: string;
  verifyByFinancialId?: string;
  notes?: string;
  status: Status;
}
