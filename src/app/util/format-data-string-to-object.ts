import { BadRequestException } from '@nestjs/common';
import { DateToSendTimePartialEntity } from '../request-send-overtime/entities/date-to-send-time.entity';

export const formatDataStringToObject = (
  date: string,
): DateToSendTimePartialEntity => {
  if (!date.includes('/')) {
    throw new BadRequestException(`Badly formatted date to send time`);
  }
  const dateSplit = date.split('/');
  const dateObject = {
    day: Number(dateSplit[0]),
    month: Number(dateSplit[1]),
    year: Number(dateSplit[2]),
  };
  return dateObject;
};
