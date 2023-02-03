export class OvertimeEntity {
  id: string;
  date: string;
  entry: Date;
  exit?: Date;
  requestSendOvertimeId?: string;
}
