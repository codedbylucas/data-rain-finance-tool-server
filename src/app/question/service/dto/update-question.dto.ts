import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateQuestionDto {
  @IsOptional()
  @Length(5, 500)
  @IsString()
  @ApiProperty({
    description: 'Question description',
    example: 'Você precisa de quantos GB de armazenamento?',
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Position where the question will be rendered',
    example: 4,
  })
  position?: number;
}
