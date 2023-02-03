export class DayTimeStatusOvertime {
  constructor(private readonly status: DayTimeStatusOvertimeEnum) {}
  returnStatus(): IDayTImeStatusOvertime {
    if (this.status === 0) {
      return {
        statusCode: 0,
        dayTimeStatus: 'entry',
      };
    }
    if (this.status === 1) {
      return {
        statusCode: 1,
        dayTimeStatus: 'exit',
      };
    }
    if (this.status === 2) {
      return {
        statusCode: 2,
        dayTimeStatus: 'finished',
      };
    }
  }
}

export enum DayTimeStatusOvertimeEnum {
  entry,
  exit,
  finished,
}

export interface IDayTImeStatusOvertime {
  statusCode: number;
  dayTimeStatus: string;
}
