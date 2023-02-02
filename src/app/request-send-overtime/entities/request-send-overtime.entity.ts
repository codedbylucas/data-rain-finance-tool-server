export class RequestSendOvertimeEntity {
  id: string;
  requestDescription: string;
  userProjectsId: string;
  overtimeId?: string;
  authorizedByManagerId?: string;
  authorizationDate?: Date;
}
