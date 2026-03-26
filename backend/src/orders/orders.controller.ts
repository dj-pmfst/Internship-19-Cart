import { 
    Controller, 
    Get, 
    Post, 
    Patch, 
    Param, 
    Body, 
    UseGuards, 
    ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserAuthGuard } from 'src/user/user-auth.guard';
import { AdminAuthGuard } from 'src/user/admin-auth.guard';
import { CurrentUser } from 'src/user/current-user.decorator';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @UseGuards(UserAuthGuard)
    @Post()
    @ApiCreatedResponse({ description: 'Nova narudzba kreirana' })
    create(@Body() dto: CreateOrderDto, @CurrentUser('id') userId: number) {
        return this.ordersService.create(dto, userId);
    }

    @UseGuards(UserAuthGuard)
    @Get('my')
    @ApiOkResponse({ description: 'Narudzbe prijavljenog korisnika' })
    findMine(@CurrentUser('id') userId: number) {
        return this.ordersService.findMine(userId);
    }

    @UseGuards(AdminAuthGuard)
    @Get()
    @ApiOkResponse({ description: 'Sve narudzbe (admin)' })
    findAll() {
        return this.ordersService.findAll();
    }

    @UseGuards(AdminAuthGuard)
    @Patch(':id/status')
    @ApiOkResponse({ description: 'Status narudzbe azuriran' })
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
    ) {
        return this.ordersService.updateStatus(id, status);
    }
}