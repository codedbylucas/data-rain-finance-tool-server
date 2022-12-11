import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class TeamEntity extends BaseEntity {
  name: string;
  valuePerHour: number;
}
