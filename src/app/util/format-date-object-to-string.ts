import { DateToSendTimeEntity } from '../request-send-overtime/entities/date-to-send-time.entity';

export const formatDateObjectToString = (
  date: DateToSendTimeEntity,
): string => {
  let dayString = date.day.toString();
  let monthString = date.month.toString();
  if (date.day < 10) {
    dayString = '0' + date.day.toString();
  }
  if (date.month < 10) {
    monthString = '0' + date.month.toString();
  }

  const dateString = dayString + '/' + monthString + '/' + date.year.toString();
  return dateString;
};
