import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateAlternativeTeamDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(99999)
  @ApiProperty({
    description: 'Hours of work to accomplish the task',
    example: 50,
  })
  workHours: number;
}
