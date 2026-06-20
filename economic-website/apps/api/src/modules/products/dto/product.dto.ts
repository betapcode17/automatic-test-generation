import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class UpsertProductDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsString()
  sku!: string;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
