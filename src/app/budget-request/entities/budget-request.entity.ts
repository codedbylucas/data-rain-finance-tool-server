import { Status } from '@prisma/client';
import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class BudgetRequestEntity extends BaseEntity {
  amount: number;
  totalHours: number;
  status: Status;
  clientId: string;
  verifyByPreSaleId: string;
  verifyByFinancialId: string;
}
