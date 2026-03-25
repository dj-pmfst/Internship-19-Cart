import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    create(dto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: {name: dto.name},
        })
    }

    findAll() {
        return this.prisma.category.findMany({
            include: { products: true }
        })
    }
}
