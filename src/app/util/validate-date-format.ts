import { BadRequestException } from '@nestjs/common';

export const validateDateFormat = (date: string): void => {
  if (!date.includes('/')) {
    throw new BadRequestException(`Badly formatted date to send time`);
  }
  const dateSplit = date.split('/');
  if (dateSplit.length !== 3) {
    throw new BadRequestException(`Badly formatted date to send time`);
  }
  if (
    dateSplit[0].length !== 2 ||
    dateSplit[1].length !== 2 ||
    dateSplit[2].length !== 4
  ) {
    throw new BadRequestException(`Badly formatted date to send time`);
  }

  const day = Number(dateSplit[0]);
  const month = Number(dateSplit[1]);
  const year = Number(dateSplit[2]);

  if (month > 12 || month < 1) {
    throw new BadRequestException(`Invalid month in date to send time`);
  }
  if (day > 31 || day < 1) {
    throw new BadRequestException(`Invalid day in date to send time`);
  }

  const currentDate = new Date();
  const currentMonth = Number(currentDate.getMonth());
  const currentYear = Number(currentDate.getFullYear());

  if (year > currentYear + 1) {
    throw new BadRequestException(
      `Impossible to place an order for such a distant date`,
    );
  }
  if (year > currentYear && month > 1 && currentMonth < 5) {
    throw new BadRequestException(
      `Impossible to place an order for such a distant date`,
    );
  }

  if (month === 2 && day > 28) {
    const leapYear = year / 4;
    if (!Number.isInteger(leapYear)) {
      throw new BadRequestException(`Invalid day in date to send time`);
    }
  }
  if (
    (month === 4 && day > 30) ||
    (month === 6 && day > 30) ||
    (month === 9 && day > 30) ||
    (month === 11 && day > 30)
  ) {
    throw new BadRequestException(`Month ${month} contains only 30 days`);
  }
};
