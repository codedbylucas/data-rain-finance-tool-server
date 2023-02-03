import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateOvertimeDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the request send overtimeId',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  requestSendOvertimeId: string;
}
