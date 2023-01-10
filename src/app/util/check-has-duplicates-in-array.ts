import { BadRequestException } from '@nestjs/common';

export const checkHasDuplicates = (array: string[], message: string): void => {
  const duplicate = new Set(array).size !== array.length;
  if (duplicate) {
    throw new BadRequestException(message);
  }
};
