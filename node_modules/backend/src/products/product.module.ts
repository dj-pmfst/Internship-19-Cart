import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductModule {}