import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 50)
  @IsString()
  @ApiProperty({
    description: 'The first name of the User',
    example: 'Lucas',
  })
  firstName: string;

  @IsOptional()
  @Length(2, 50)
  @IsString()
  @ApiProperty({
    description: 'The last name of the User',
    example: 'Marques',
  })
  lastName: string;

  @IsOptional()
  @IsEmail()
  @Length(3, 100)
  @ApiProperty({
    description: 'The email of the User',
    example: 'email@mail.com',
  })
  email: string;

  @IsOptional()
  @ApiProperty({
    description: 'Current password of User',
    example: 'Abcd@1234',
  })
  currentPassword: string;

  @IsOptional()
  @IsString()
  @Length(8, 50)
  @ApiProperty({
    description: 'The new password of the User',
    example: 'Abcd@1234',
  })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User new password confirmation',
    example: 'Abcd@1234',
  })
  confirmPassword: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  @ApiProperty({
    description: 'The phone of the User',
    example: '11 99100-9900',
  })
  phone: string;
}
