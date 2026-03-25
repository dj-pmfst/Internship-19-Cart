import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async findAll(
        search?: string,
        category?: string,
        sort?: string,
        inStock?: boolean,
        page: number = 1,
        limit: number = 10,
    ) {
        const skip = (page - 1) * limit;

        const where = {
            name: search ? { contains: search, mode: 'insensitive' as const } : undefined,
            category: category ? { name: category } : undefined,
            inStock: inStock !== undefined ? inStock : undefined,
        };

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: sort ? { [sort]: 'asc' } : { createdAt: 'desc' },
                include: { category: true },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!product) {
            throw new NotFoundException(`Product #${id} not found`);
        }

        return product;
    }

    create(dto: CreateProductDto) {
        const { categoryId, ...rest } = dto;
        return this.prisma.product.create({
            data: {
                ...rest,
                category: { connect: { id: categoryId } },
            },
            include: { category: true },
        });
    }

    async update(id: number, dto: UpdateProductDto) {
        await this.findOne(id); 

        const { categoryId, ...rest } = dto;
        return this.prisma.product.update({
            where: { id },
            data: {
                ...rest,
                category: categoryId
                    ? { connect: { id: categoryId } }
                    : undefined,
            },
            include: { category: true },
        });
    }

    async remove(id: number) {
        await this.findOne(id); 
        return this.prisma.product.delete({ where: { id } });
    }
}