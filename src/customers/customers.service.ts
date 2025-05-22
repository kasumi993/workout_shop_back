import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }

  async create(customerData: Partial<Customer>): Promise<Customer> {
    // Hash the password if provided
    if (customerData.password) {
      customerData.password = await bcrypt.hash(customerData.password, 10);
    }

    return this.prisma.customer.create({
      data: customerData as CreateCustomerDto, // Type assertion needed because Partial<Customer> might not match exact Prisma type
    });
  }

  async update(id: string, customerData: Partial<Customer>): Promise<Customer> {
    // Verify customer exists
    await this.findOne(id);

    // Hash the password if it's being updated
    if (customerData.password) {
      customerData.password = await bcrypt.hash(customerData.password, 10);
    }

    return this.prisma.customer.update({
      where: { id },
      data: customerData as UpdateCustomerDto, // Type assertion needed because Partial<Customer> might not match exact Prisma type
    });
  }

  async remove(id: string): Promise<void> {
    // Verify customer exists
    await this.findOne(id);

    await this.prisma.customer.delete({
      where: { id },
    });
  }
}
