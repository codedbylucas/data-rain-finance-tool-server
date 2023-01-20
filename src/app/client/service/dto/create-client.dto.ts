import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateClientDto {
  @IsEmail()
  @Length(3, 100)
  @ApiProperty({
    description: 'Contact email',
    example: 'blue@mail.com',
  })
  email: string;

  @Length(8, 16)
  @IsString()
  @ApiProperty({
    description: 'Contact phone',
    example: '(11) 9 9933-9933',
  })
  phone: string;

  @Length(2, 100)
  @IsString()
  @ApiProperty({
    description: 'Company Name',
    example: 'Blue EdTech',
  })
  companyName: string;

  @IsOptional()
  @Length(2, 100)
  @IsString()
  @ApiProperty({
    description: 'Main customer contact',
    example: 'Adailton',
  })
  mainContact: string;

  @IsOptional()
  @Length(2, 100)
  @IsString()
  @ApiProperty({
    description: 'Technical customer contact',
    example: 'José',
  })
  technicalContact?: string;

  @IsOptional()
  @Length(8, 16)
  @IsString()
  @ApiProperty({
    description: 'Technical contact phone',
    example: '(21) 9 8933-9933',
  })
  technicalContactPhone?: string;

  @IsOptional()
  @IsEmail()
  @Length(5, 100)
  @ApiProperty({
    description: 'Technical contact email',
    example: 'technical@mail.com',
  })
  technicalContactEmail?: string;

  @IsOptional()
  @Length(2, 50)
  @IsString()
  @ApiProperty({
    description: 'Project Name',
    example: 'eCommerce',
  })
  projectName?: string;

  @IsOptional()
  @Length(1, 100)
  @IsString()
  @ApiProperty({
    description: 'Expected time to complete the project',
    example: '6 meses',
  })
  timeProject?: string;

  @IsOptional()
  @Length(2, 1000)
  @IsString()
  @ApiProperty({
    description: 'Application Description',
    example: 'Virtual Store',
  })
  applicationDescription?: string;
}
