export class NormalHourEntity {
  id: string;
  date: string;
  entry: Date;
  exitToBreak?: Date;
  backFromTheBreak?: Date;
  exit?: Date;
  userProjectId: string;
}
