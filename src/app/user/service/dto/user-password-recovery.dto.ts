import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserPasswordRecoveryDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email of the User',
    example: 'any_email@mail.com',
  })
  email: string;
}
