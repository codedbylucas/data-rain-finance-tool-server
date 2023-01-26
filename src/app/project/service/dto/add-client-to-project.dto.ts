import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddClientToProjectDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the client',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  clientId: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the project',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  projectId: string;
}
