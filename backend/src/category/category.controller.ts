import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../user/admin-auth.guard';

@ApiTags('category')
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({ description: 'Dohvaćene sve kategorije' })
  findAll() {
    return this.categoryService.findAll()
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  @ApiCreatedResponse({ description: 'Kreirana nova kategorija' })
  create(@Body() dto: CreateCategoryDto) {
      return this.categoryService.create(dto)
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'Obrisana kategorija' })
  remove(@Param('id', ParseIntPipe) id: number) {
      return this.categoryService.remove(id)
  }
}