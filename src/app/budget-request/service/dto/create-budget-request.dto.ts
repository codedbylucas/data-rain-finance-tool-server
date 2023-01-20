import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';

export class BudgetRequest {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the question answered by the client',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  questionId: string;

  // @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Id of the alternative marked by the client',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  alternativeId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Additional details about the answers',
    example: 'Preciso que tenham estes detalhes...',
  })
  responseDetails: string;
}

export class CreateBudgetRequestDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the client',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  clientId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetRequest)
  @ApiProperty({
    isArray: true,
    type: BudgetRequest,
  })
  responses: BudgetRequest[];
}
