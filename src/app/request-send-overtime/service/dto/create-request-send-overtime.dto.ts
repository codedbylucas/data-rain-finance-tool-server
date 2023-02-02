import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateRequestSendOvertimeDto {
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
  @Length(2, 200)
  @ApiProperty({
    description: 'Order description to post overtime',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  requestDescription: string;
}
