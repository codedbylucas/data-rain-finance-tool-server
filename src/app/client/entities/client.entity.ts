import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class ClientEntity extends BaseEntity {
  email: string;
  phone: string;
  primaryContactName: string;
  companyName: string;
}
