import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ApprovedBudgetRequestDto {
  @IsString()
  @ApiProperty({
    description: 'Budget Request id to be approved',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  budgetRequestId: string;
}
