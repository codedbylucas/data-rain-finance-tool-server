import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class UserEntity extends BaseEntity {
  name: string;
  email: string;
  password: string;
  phone: string;
  imageUrl: string;
  role: string;
}
