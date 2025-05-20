import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsArray()
  @IsOptional()
  properties?: Array<{ name: string; values: string[] }>;
}
