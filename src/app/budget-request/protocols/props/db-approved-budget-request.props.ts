import { Status } from '@prisma/client';

export interface DbAprrovedByPreSaleBudgetRequestProps {
  budgetRequestId: string;
  verify_by_pre_sale_id?: string;
  verify_by_financial_id?: string;
  status: Status;
}
