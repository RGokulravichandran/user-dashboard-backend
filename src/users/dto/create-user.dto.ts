import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Gokul R', description: 'Username' })
  @IsString()
  readonly username: string;

  @ApiProperty({ example: 'rgokulravichandran@gmail.com', description: 'User email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'Gokul@123', description: 'User password' })
  @IsString()
  readonly password: string;

  @ApiProperty({ example: 'Gokul', description: 'User first name', required: false })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiProperty({ example: 'R', description: 'User last name', required: false })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiProperty({ example: 'user', description: 'User role', enum: Role, enumName: 'Role' })
  @IsOptional()
  @IsEnum(Role)
  readonly role?: Role;
}