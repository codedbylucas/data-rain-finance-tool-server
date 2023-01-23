import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class FormResponseDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Form response Id to receive the update',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  id: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999)
  @IsOptional()
  @ApiProperty({
    description: 'Value per hour of team',
    example: 211.93,
  })
  valuePerHour?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Max(99999)
  @ApiProperty({
    description: 'Hours of work to accomplish the task',
    example: 40,
  })
  workHours?: number;
}

export class UpdatedBudgetRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormResponseDto)
  @ApiProperty({
    isArray: true,
    type: FormResponseDto,
  })
  formResponses: FormResponseDto[];
}
