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
  firstName: string;

  @Length(2, 50)
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 50)
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  role: string;
}
