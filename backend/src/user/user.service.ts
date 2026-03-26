import {
    Injectable,
    BadRequestException,
    ForbiddenException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(email: string, password: string) {
        const existingUser = await this.prisma.user.findUnique({
        where: {
            email,
        },
        });

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const payload = {
            id: user.id,
            email: user.email,
            role: 'user',
        };

        return {
            token: this.jwtService.sign(payload),
        };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new BadRequestException('User does not exist');
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new ForbiddenException('Password not valid');
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.isAdmin ? 'admin' : 'user',
        };

        return {
            token: this.jwtService.sign(payload),
        };
    }

    getMe(userId: number) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                isAdmin: true,
                address: true,
                paymentMethod: true,
            },
        });
    }
    
    async updateMe(userId: number, dto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: dto,
            select: {
                id: true,
                email: true,
                isAdmin: true,
                address: true,
                paymentMethod: true,
            },
        });
    }
}