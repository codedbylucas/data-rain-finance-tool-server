export interface DbFindAllRequestSendOvertimeUserStatusProps {
  userProjectId: string;
  startDate: {
    day: number;
    month: number;
    year: number;
  };
  endDate: {
    month: number;
    year: number;
  };
}
