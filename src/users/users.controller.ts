import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { Query } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
    findAll(@Query() paginationDto: PaginationDto, @CurrentUser() user: User) {
        return this.usersService.findAll(paginationDto, user.role, user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Put(':id')
    @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: User) {
        const targetUser = await this.usersService.findOne(id);
        if (!targetUser) {
            throw new NotFoundException('User not found');
        }

        // Regular users can only update their own profile
        if (currentUser.role === Role.USER && currentUser.id !== id) {
            throw new ForbiddenException('You can only update your own profile');
        }

        // Admin users cannot modify other admins or super admins
        if (currentUser.role === Role.ADMIN && (targetUser.role === Role.ADMIN || targetUser.role === Role.SUPER_ADMIN)) {
            throw new ForbiddenException('Admins cannot modify other admins or super admins');
        }

        // Super admin users can modify admins and users, but not other super admins
        if (currentUser.role === Role.SUPER_ADMIN && targetUser.role === Role.SUPER_ADMIN && currentUser.id !== id) {
            throw new ForbiddenException('Super admins cannot modify other super admins');
        }

        // Filter updateUserDto based on user role before passing to service
        let filteredUpdateDto: UpdateUserDto = {};
        if (currentUser.role === Role.USER) {
            // Regular users can only update username, firstName, lastName, and status
            if (updateUserDto.username !== undefined) filteredUpdateDto.username = updateUserDto.username;
            if (updateUserDto.firstName !== undefined) filteredUpdateDto.firstName = updateUserDto.firstName;
            if (updateUserDto.lastName !== undefined) filteredUpdateDto.lastName = updateUserDto.lastName;
            if (updateUserDto.status !== undefined) filteredUpdateDto.status = updateUserDto.status;
        } else {
            // Admins and Super Admins can update all fields in updateUserDto
            filteredUpdateDto = updateUserDto;
        }

        return this.usersService.update(id, filteredUpdateDto, currentUser.role);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    async remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
        const targetUser = await this.usersService.findOne(id);
        if (!targetUser) {
            throw new NotFoundException('User not found');
        }

        // Admin users cannot delete other admins or super admins
        if (currentUser.role === Role.ADMIN && (targetUser.role === Role.ADMIN || targetUser.role === Role.SUPER_ADMIN)) {
            throw new ForbiddenException('Admins cannot delete other admins or super admins');
        }

        // Super admin users can delete admins and users, but not other super admins
        if (currentUser.role === Role.SUPER_ADMIN && targetUser.role === Role.SUPER_ADMIN) {
            throw new ForbiddenException('Super admins cannot delete other super admins');
        }

        return this.usersService.remove(id);
    }
}