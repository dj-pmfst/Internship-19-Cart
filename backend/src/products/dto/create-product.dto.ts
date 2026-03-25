import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
    IsString, 
    IsNumber, 
    IsBoolean, 
    IsOptional, 
    IsArray, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty()
    @IsString()
    brand: string;

    @ApiProperty()
    @IsNumber()
    categoryId: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    sizes?: string[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    colors?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    inStock?: boolean;
}