import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class UserEntity extends BaseEntity {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  billable: boolean;
  allocated: boolean;
  validatedEmail: boolean;
  roleName: string;
  positionName: string;
}
