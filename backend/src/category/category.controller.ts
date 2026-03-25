import {
    Controller,
    Get,
    Post,
    Body
  } from '@nestjs/common';
  import { CategoryService } from './category.service';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('categorys')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get()
    @ApiOkResponse({ description: 'Dohvaćene sve kategorije' })
    findAll() {
      return this.categoryService.findAll()
    }

    @Post()
    @ApiCreatedResponse({ description: 'Kreirana nova kategorija' })
    create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto)
    }
}
