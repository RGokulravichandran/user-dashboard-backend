import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'Gokul R', description: 'Username' })
  @IsString()
  readonly username: string;

  @ApiProperty({ example: 'rgokulravichandran@gmail.com', description: 'User email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'Gokul@123', description: 'User password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({ example: 'Gokul', description: 'User first name', required: false })
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'R', description: 'User last name', required: false })
  @IsString()
  lastName?: string;
}