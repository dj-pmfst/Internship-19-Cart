import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Req
  } from '@nestjs/common';
import { FavoriteService } from './favorites.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
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
  @Post()
  @ApiCreatedResponse({ description: 'Kreiran novi favorit' })
  create(@Body() dto: CreateFavouriteDto, @Req() req) {
    return this.favoriteService.create(dto, req.user.id)
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'Obrisan favorit' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.favoriteService.remove(id, req.user.id)
  }
}