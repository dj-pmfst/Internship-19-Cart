import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
    UseGuards
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/user/admin-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    @ApiOkResponse({ description: 'Dohvaćeni svi proizvodi' })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'category', required: false })
    @ApiQuery({ name: 'sort', required: false })
    @ApiQuery({ name: 'inStock', required: false, type: Boolean })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('sort') sort?: string,
        @Query('inStock') inStock?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.productsService.findAll(
            search,
            category,
            sort,
            inStock !== undefined ? inStock === 'true' : undefined,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
        )
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Dohvaćen jedan proizvod' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id)
    }

    @UseGuards(AdminAuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Kreiran novi proizvod' })
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto)
    }

    @UseGuards(AdminAuthGuard)
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Ažuriran proizvod' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto)
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Obrisan proizvod' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id)
    }
}