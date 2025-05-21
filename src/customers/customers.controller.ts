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
import { Customer } from './entities/customer.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() customerData: Partial<Customer>): Promise<Customer> {
    return this.customersService.create(customerData);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() customerData: Partial<Customer>,
  ): Promise<Customer> {
    return this.customersService.update(id, customerData);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.customersService.remove(id);
  }
}
