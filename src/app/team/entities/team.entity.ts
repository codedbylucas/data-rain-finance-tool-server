import { BaseEntity } from 'src/app/util/base-entity/base-entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'teams' })
export class TeamEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', name: 'value_per_hour' })
  valuePerHour: number;
}
