import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @Length(2, 50)
  @IsString()
  @ApiProperty({
    description: 'Name of the Project',
    example: 'Project 01',
  })
  name: string;

  @Length(5, 500)
  @IsString()
  @ApiProperty({
    description: 'Project description',
    example: 'This is the project description',
  })
  description: string;
}
