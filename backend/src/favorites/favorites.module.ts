import { Module } from '@nestjs/common';
import { FavoriteController } from './favorites.controller';
import { FavoriteService } from './favorites.service';
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [FavoriteController],
  providers: [FavoriteService]
})
export class FavoritesModule {}
