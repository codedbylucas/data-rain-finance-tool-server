export interface FindHoursPostedInTheDayResposne {
  date: string;
  entry: string;
  exitToBreak: string | null;
  backFromTheBreak: string | null;
  exit: string | null;
}
