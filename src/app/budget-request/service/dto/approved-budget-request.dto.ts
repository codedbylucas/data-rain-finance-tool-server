import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class ApprovedBudgetRequestDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Budget Request id to be approved',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  budgetRequestId: string;

  @IsOptional()
  @IsString()
  @Length(2, 300)
  @ApiProperty({
    description: 'Rotes for budget request',
    example: 'This is an example of a note',
  })
  notes?: string;
}
