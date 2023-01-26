import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class ProjectEntity extends BaseEntity {
  name: string;
  description: string;
  clientId?: string;
}
