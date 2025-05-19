import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsUUID,
  IsObject,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsObject()
  @IsOptional()
  properties?: Record<string, any>;
}