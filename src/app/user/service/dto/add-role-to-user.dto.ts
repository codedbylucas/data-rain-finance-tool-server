import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddRoleToUserDto {
  @IsUUID()
  @ApiProperty({
    description: 'User id that will receive a role',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  userId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Id of the alternative marked by the client',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  roleId: string;
}
