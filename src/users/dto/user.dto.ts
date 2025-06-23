import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class UserDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: 'user', description: 'User role', enum: Role, enumName: 'Role' })
  @Expose()
  role: Role;

  @ApiProperty({ example: true, description: 'User status (active/inactive)' })
  @Expose()
  status: boolean;

  @ApiProperty({ example: '2023-01-01T12:00:00Z', description: 'User creation timestamp' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T12:00:00Z', description: 'User last update timestamp' })
  @Expose()
  updatedAt: Date;
}