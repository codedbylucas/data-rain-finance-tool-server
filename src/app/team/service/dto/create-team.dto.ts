import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateTeamDto {
  @Length(1, 100)
  @IsString()
  @ApiProperty({
    description: 'Name of the team',
    example: 'Back-end developers',
  })
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Value per hour of team',
    example: 99.99,
  })
  valuePerHour: number;
}
