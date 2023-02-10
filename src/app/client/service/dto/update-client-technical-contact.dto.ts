import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateTechnicalContatctClientDto {
  @IsOptional()
  @Length(2, 100)
  @IsString()
  @ApiProperty({
    description: 'Technical contact name',
    example: 'João Silva',
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @Length(3, 100)
  @ApiProperty({
    description: 'Technical contact email',
    example: 'contactTechnical@mail.com',
  })
  email?: string;

  @IsOptional()
  @Length(8, 16)
  @IsString()
  @ApiProperty({
    description: 'Technical contact phone',
    example: '(11) 9 9933-9933',
  })
  phone?: string;
}
