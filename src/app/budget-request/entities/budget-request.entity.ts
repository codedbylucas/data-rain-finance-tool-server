import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class BudgetRequestEntity extends BaseEntity {
  clientId: string;
  verifyByPreSaleId: string;
  verifyByFinancialId: string;
}
