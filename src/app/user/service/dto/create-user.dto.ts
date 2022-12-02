import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 50)
  @IsString()
  @ApiProperty({
    description: 'The first name of the User',
    example: 'Lucas',
  })
  firstName: string;

  @Length(2, 50)
  @IsString()
  @ApiProperty({
    description: 'The last name of the User',
    example: 'Marques',
  })
  lastName: string;

  @IsEmail()
  @Length(3, 100)
  @ApiProperty({
    description: 'The email of the User',
    example: 'email@mail.com',
  })
  email: string;

  @IsString()
  @Length(8, 50)
  @ApiProperty({
    description: 'The password of the User',
    example: 'Abcd@1234',
  })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User password confirmation',
    example: 'Abcd@1234',
  })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  @ApiProperty({
    description: 'The phone of the User',
    example: '11 99100-9900',
  })
  phone: string;

  @IsNotEmpty()
  @ApiProperty({
    description: `The User role ('financial' or 'preSale')`,
    example: 'preSale',
  })
  role: string;
}
