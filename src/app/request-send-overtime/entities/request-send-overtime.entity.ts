import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class RequestSendOvertimeEntity extends BaseEntity {
  requestDescription: string;
  requestDate: string;
  userProjectId: string;
  // overtimeId?: string;
  authorizedByManagerId?: string;
  authorizationDate?: String;
}
