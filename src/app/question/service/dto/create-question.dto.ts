import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateQuestionDto {
  @Length(5, 500)
  @IsString()
  @ApiProperty({
    description: 'Question description',
    example: 'Você precisa de quantos GB de armazenamento?',
  })
  description: string;
}
