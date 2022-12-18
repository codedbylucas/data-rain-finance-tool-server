import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateAlternativeTeamDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the alternative that will be associated with a team',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  alternativeId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the team that will be associated with a alternative',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  teamId: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @ApiProperty({
    description: 'Hours of work to accomplish the task',
    example: 20,
  })
  workHours: number;
}
