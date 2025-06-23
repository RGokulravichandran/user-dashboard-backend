import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Role } from '../common/enums/role.enum';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Status } from '@/common/enums/status.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto) {
        if (!signupDto.password) {
            throw new UnauthorizedException('Password is required');
        }
        const existingUser = await this.userRepo.findOne({ where: { email: signupDto.email } });
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const hashed = await bcrypt.hash(signupDto.password, 10);
        const user = this.userRepo.create({
            username: signupDto.username,
            email: signupDto.email,
            password: hashed,
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
            role: Role.USER,
        });
        return this.userRepo.save(user);
    }

    async login(email: string, password: string) {
        const user = await this.userRepo.findOne({ where: { email: email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.status === Status.INACTIVE) {
            throw new UnauthorizedException('Please contact admin, your ID is temporarily inactive');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return { token };
    }
}
