import { BaseEntity } from 'src/app/util/base-entity/base-entity';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'users' })
@Index(['email'], { unique: true })
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @Column()
  role: string;
}
