import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AprroveAndReproveRequestSendOvertimeDto {
  @IsUUID()
  @ApiProperty({
    description: 'Request id to send overtime',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  requestSendOvertimeId: string;
}
