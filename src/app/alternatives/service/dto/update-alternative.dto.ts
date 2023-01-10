import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { TeamDto } from './create-alternative.dto';

export class UpdateAlternativeDto {
  @Length(1, 250)
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Alternative description',
    example: '9 GB',
  })
  description?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TeamDto)
  @ApiProperty({
    isArray: true,
    type: TeamDto,
  })
  teams?: TeamDto[];
}
