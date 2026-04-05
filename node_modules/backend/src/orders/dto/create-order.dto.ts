import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @ApiProperty()
    @IsInt()
    productId: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty()
    @IsString()
    shippingAddress: string;

    @ApiProperty()
    @IsString()
    billingAddress: string;
}