import { ApprovalStatus } from '@prisma/client';
import { OvertimeEntity } from 'src/app/overtime/entities/overtime.entity';
import { BaseEntity } from 'src/app/util/base-entity/base-entity';
import { DateToSendTimeEntity } from './date-to-send-time.entity';

export class RequestSendOvertimeEntity extends BaseEntity {
  requestDescription: string;
  requestDate: string;
  approvalSatus: ApprovalStatus;
  userProjectId: string;
  managerId: string;
  validatedByUserId?: string;
  overtime?: OvertimeEntity;
  dateToSendTime?: DateToSendTimeEntity;
  validation_date?: Date;
}
