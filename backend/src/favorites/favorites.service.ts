import { Injectable } from '@nestjs/common';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
    constructor(private prisma: PrismaService) {}

    create(dto: CreateFavouriteDto, userId: number) {
        return this.prisma.favourite.create({
            data: { 
                productId: dto.productId,
                userId 
            },
            include: { product: true }  
        })
    }

    findAll(userId: number) {
        return this.prisma.favourite.findMany({
            where: {userId},
            include: { product: true }  
        })
    }

    remove(productId: number, userId: number) {
        return this.prisma.favourite.deleteMany({
            where: { productId, userId }
        })
    }
}
