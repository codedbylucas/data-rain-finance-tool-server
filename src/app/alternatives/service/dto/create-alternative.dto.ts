import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateAlternativeDto {
  @Length(1, 250)
  @IsString()
  @ApiProperty({
    description: 'Alternative description',
    example: '9 GB',
  })
  description: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Id of the question that will be associated with the alternative',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  questionId: string;
}
