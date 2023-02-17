import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

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

  @IsUUID()
  @ApiProperty({
    description: 'Id of the role that will be added to the user',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  positionId: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User is billabel or not',
    example: true,
  })
  billable: boolean;

  @IsUUID()
  @ApiProperty({
    description: 'Id of the role that will be added to the user',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  roleId: string;
}
