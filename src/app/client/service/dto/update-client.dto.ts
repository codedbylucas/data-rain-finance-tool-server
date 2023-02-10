import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsEmail()
  @Length(3, 100)
  @ApiProperty({
    description: 'Contact email',
    example: 'blue@mail.com',
  })
  email?: string;

  @IsOptional()
  @Length(8, 16)
  @IsString()
  @ApiProperty({
    description: 'Contact phone',
    example: '(11) 9 9933-9933',
  })
  phone: string;

  @IsOptional()
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
    description: 'Primary customer contact',
    example: 'Adailton',
  })
  primaryContactName: string;
}
