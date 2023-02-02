import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class RequestSendOvertimeEntity extends BaseEntity {
  requestDescription: string;
  userProjectId: string;
  requestDate: string;
  // overtimeId?: string;
  authorizedByManagerId?: string;
  authorizationDate?: Date;
}
