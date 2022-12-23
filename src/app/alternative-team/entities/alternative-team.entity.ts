import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class AlternativeTeamEntity extends BaseEntity {
  alternativeId: string;
  teamId: string;
  workHours?: number;
}
