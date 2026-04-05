import { Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateOrderDto, userId: number) {
        const productIds = dto.items.map((i) => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
            throw new NotFoundException('Product(s) not found');
        }

        const total = dto.items.reduce((sum, item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return sum + product.price * item.quantity;
        }, 0);

        return this.prisma.order.create({
            data: {
                userId,
                total,
                shippingAddress: dto.shippingAddress,
                billingAddress: dto.billingAddress,
                items: {
                    create: dto.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: products.find((p) => p.id === item.productId)!.price,
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });
    }

    findMine(userId: number) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    findAll() {
        return this.prisma.order.findMany({
            include: {
                items: { include: { product: true } },
                user: { select: { id: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: number, status: string) {
        const order = await this.prisma.order.findUnique({ where: { id } });

        if (!order) throw new NotFoundException(`Order #${id} not found`);

        return this.prisma.order.update({
            where: { id },
            data: { status: status as any },
            include: { items: { include: { product: true } } },
        });
    }
}