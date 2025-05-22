import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
