import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class TeamDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the team',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  teamId: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Max(99999)
  @ApiProperty({
    description: 'Hours of work to accomplish the task',
    example: 20,
  })
  workHours?: number;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamDto)
  @ApiProperty({
    isArray: true,
    type: TeamDto,
  })
  teams: TeamDto[];
}
