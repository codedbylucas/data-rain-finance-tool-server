import { BadRequestException } from '@nestjs/common';

export const checkIfEmailIsValid = (email: string): void => {
  const regexExp =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
  const emailTested = regexExp.test(email);
  if (!emailTested) {
    throw new BadRequestException(`Email '${email}' is invalid`);
  }
};
