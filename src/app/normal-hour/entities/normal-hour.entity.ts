export class NormalHourEntity {
  id: string;
  date: string;
  entry: Date;
  exitBreak?: Date;
  backBreack?: Date;
  exit?: Date;
  userProjectId: string;
}
