export class DayTimeStatusNormalHour {
  constructor(private readonly status: DayTimeStatusEnum) {}
  returnStatus(): IDayTImeStatus {
    if (this.status === 0) {
      return {
        statusCode: 0,
        dayTimeStatus: 'entry',
      };
    }
    if (this.status === 1) {
      return {
        statusCode: 1,
        dayTimeStatus: 'exitToBreak',
      };
    }
    if (this.status === 2) {
      return {
        statusCode: 2,
        dayTimeStatus: 'backFromTheBreak',
      };
    }
    if (this.status === 3) {
      return {
        statusCode: 3,
        dayTimeStatus: 'exit',
      };
    }
  }
}

export enum DayTimeStatusEnum {
  entry,
  exitToBreak,
  backFromTheBreak,
  exit,
}

export interface IDayTImeStatus {
  statusCode: number;
  dayTimeStatus: string;
}
