import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class ClientEntity extends BaseEntity {
  email: string;
  phone: string;
  mainContact: string;
  companyName: string;
  technicalContact?: string;
  technicalContactPhone?: string;
  technicalContactEmail?: string;
}
