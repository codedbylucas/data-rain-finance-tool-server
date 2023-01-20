import { BadRequestException } from '@nestjs/common';

export const checkIfItsUiid = (id: string, message: string): void => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  const idTested = regexExp.test(id);
  if (!idTested) {
    throw new BadRequestException(message);
  }
};
