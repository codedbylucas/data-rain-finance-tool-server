import { ApprovalStatus } from '@prisma/client';
import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class RequestSendOvertimeEntity extends BaseEntity {
  requestDescription: string;
  requestDate: String;
  approvalSatus: ApprovalStatus;
  userProjectId: string;
  managerId: string;

  disapprovalDate?: Date;
  authorizationDate?: Date;
}
