import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/pagination/pagination.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(paginationDto: PaginationDto, requesterRole?: string, requesterId?: string) {
        const { page = 1, limit = 10, search, orderBy, order } = paginationDto;
        const queryBuilder = this.usersRepository.createQueryBuilder('user');

        if (requesterRole === 'ADMIN') {
            queryBuilder.andWhere('user.role != :role', { role: 'SUPER_ADMIN' });
        } else if (requesterRole === 'USER') {
            queryBuilder.andWhere('user.id = :id', { id: requesterId });
        }

        if (search) {
            queryBuilder.where('LOWER(user.username) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search)', { search: `%${search}%` });
        }

        if (orderBy) {
            queryBuilder.orderBy(`user.${orderBy}`, order);
        }

        queryBuilder.skip((page - 1) * limit).take(limit);

        return queryBuilder.getMany();
    }

    findOne(id: string) {
        return this.usersRepository.findOneBy({ id });
    }

    findOneByEmail(email: string) {
        return this.usersRepository.findOneBy({ email });
    }


    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto, requesterRole: string) {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('User not found');

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        // Only allow role updates if the requester is an ADMIN or SUPER_ADMIN
        if (requesterRole === 'ADMIN' || requesterRole === 'SUPER_ADMIN') {
            Object.assign(user, updateUserDto);
        } else {
            // For regular users, ensure role is not updated
            const { role, ...rest } = updateUserDto;
            Object.assign(user, rest);
        }

        return this.usersRepository.save(user);
    }

    remove(id: string) {
        return this.usersRepository.delete(id);
    }
}
