import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class TechnicalContactDto {
  @Length(2, 100)
  @IsString()
  @ApiProperty({
    description: 'Technical contact name',
    example: 'João Silva',
  })
  name: string;

  @IsEmail()
  @Length(3, 100)
  @ApiProperty({
    description: 'Technical contact email',
    example: 'contactTechnical@mail.com',
  })
  email: string;

  @Length(8, 16)
  @IsString()
  @ApiProperty({
    description: 'Technical contact phone',
    example: '(11) 9 9933-9933',
  })
  phone: string;
}

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

  @Length(2, 100)
  @IsString()
  @ApiProperty({
    description: 'Primary customer contact',
    example: 'Adailton',
  })
  primaryContactName: string;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TechnicalContactDto)
  @ApiProperty({
    type: TechnicalContactDto,
  })
  technicalContact?: TechnicalContactDto;
}
