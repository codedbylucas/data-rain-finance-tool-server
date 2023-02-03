import { ApprovalStatus } from '@prisma/client';
import { OvertimeEntity } from 'src/app/overtime/entities/overtime.entity';
import { BaseEntity } from 'src/app/util/base-entity/base-entity';

export class RequestSendOvertimeEntity extends BaseEntity {
  requestDescription: string;
  requestDate: String;
  approvalSatus: ApprovalStatus;
  userProjectId: string;
  managerId: string;
  overtime?: OvertimeEntity;
  disapprovalDate?: Date;
  authorizationDate?: Date;
}
