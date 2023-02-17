import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class AskPermissionToSendOvertimeDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Id of the project where the order for overtime will be created',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date that the overtime will be performed',
    example: '23/02/2023',
  })
  dateToSendTime: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  @ApiProperty({
    description: 'Order description to post overtime',
    example: 'I need to do overtime to restart the server',
  })
  requestDescription: string;
}
