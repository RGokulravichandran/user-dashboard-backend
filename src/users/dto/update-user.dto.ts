import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'jane_doe_updated', description: 'Updated username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'Jane', description: 'Updated first name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Updated last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'jane.doe.updated@example.com', description: 'Updated user email', required: false })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ example: 'active', description: 'User status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'newsecurepassword', description: 'Updated user password', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'admin', description: 'Updated user role', enum: Role, enumName: 'Role', required: false })
  @IsOptional()
  @IsEnum(Role)
  readonly role?: Role;
}