import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateAlternativeDto {
  @Length(1, 250)
  @IsString()
  @ApiProperty({
    description: 'Alternative description',
    example: '9 GB',
  })
  description: string;
}
