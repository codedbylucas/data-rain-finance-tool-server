import { InternalServerErrorException } from '@nestjs/common';

export function serverError(error: Error): undefined {
  const errorLines = error.message?.split('\n');
  const lastErrorLine = errorLines[errorLines.length - 1].trim();
  console.log(error);
  throw new InternalServerErrorException(
    lastErrorLine || 'Oops, something happened.',
  );
}
