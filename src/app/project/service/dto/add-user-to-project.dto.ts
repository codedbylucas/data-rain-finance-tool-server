import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class AddUserToProjectDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the user',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  userId: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the project',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  projectId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999)
  @ApiProperty({
    description: 'Value per hour of user',
    example: 41.27,
  })
  valuePerUserHour: number;
}
