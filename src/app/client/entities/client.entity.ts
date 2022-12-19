import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class ClientEntity extends BaseEntity {
  name?: string;
  companyName: string;
  email?: string;
  phone?: string;
}
