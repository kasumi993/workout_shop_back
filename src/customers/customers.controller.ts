import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from '@prisma/client';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @UseGuards(SupabaseAuthGuard)
  @Post()
  create(@Body() customerData: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(customerData);
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() customerData: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, customerData);
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.customersService.remove(id);
  }
}
