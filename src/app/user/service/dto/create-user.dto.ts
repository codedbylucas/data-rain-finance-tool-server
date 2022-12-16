import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2, 70)
  @IsString()
  @ApiProperty({
    description: 'Name of the User',
    example: 'Vini',
  })
  name: string;

  @IsEmail()
  @Length(3, 100)
  @ApiProperty({
    description: 'Email of the User',
    example: 'violigon@mail.com',
  })
  email: string;

  @Length(2, 200)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Postion of the user',
    example: 'Cloud DevOps Architect',
  })
  position: string;
}
