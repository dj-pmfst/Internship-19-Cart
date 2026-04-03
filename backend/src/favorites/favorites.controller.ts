import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req
} from '@nestjs/common';
import { FavoriteService } from './favorites.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/user/user-auth.guard';

@ApiTags('Favorite')
@Controller('favorites')
export class FavoriteController {
constructor(private favoriteService: FavoriteService) {}

@UseGuards(UserAuthGuard)
@Get()
@ApiOkResponse({ description: 'Dohvaćeni svi favoriti' })
findAll(@Req() req) {
  return this.favoriteService.findAll(req.user.id)
}

@UseGuards(UserAuthGuard)
@Post(':productId')
@ApiCreatedResponse({ description: 'Kreiran novi favorit' })
create(@Param('productId', ParseIntPipe) productId: number, @Req() req) {
  return this.favoriteService.create(productId, req.user.id)
}

@UseGuards(UserAuthGuard)
@Delete(':productId')
@ApiOkResponse({ description: 'Obrisan favorit' })
remove(@Param('productId', ParseIntPipe) productId: number, @Req() req) {
  return this.favoriteService.remove(productId, req.user.id)
}
}