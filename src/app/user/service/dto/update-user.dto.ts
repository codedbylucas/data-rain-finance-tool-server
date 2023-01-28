import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'User is billabel or not',
    example: true,
  })
  billable?: boolean;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Id of the role that will be added to the user',
    example: 'ac06f36e-4b61-4fe8-8fd6-6ad807ac6282',
  })
  roleId?: string;
}
