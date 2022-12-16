import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class FirstAccessDto {
  @IsString()
  @Length(8, 50)
  @ApiProperty({
    description: 'The new password of the User',
    example: 'Abcd@1234',
  })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
    { message: 'Password too weak' },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User new password confirmation',
    example: 'Abcd@1234',
  })
  confirmPassword: string;
}
