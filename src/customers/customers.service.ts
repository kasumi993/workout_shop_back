import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { email } });
  }

  async create(customerData: Partial<Customer>): Promise<Customer> {
    // Hash the password if provided
    if (customerData.password) {
      customerData.password = await bcrypt.hash(customerData.password, 10);
    }

    const newCustomer = this.customerRepository.create(customerData);
    return this.customerRepository.save(newCustomer);
  }

  async update(id: string, customerData: Partial<Customer>): Promise<Customer> {
    await this.findOne(id); // Verify customer exists

    // Hash the password if it's being updated
    if (customerData.password) {
      customerData.password = await bcrypt.hash(customerData.password, 10);
    }

    await this.customerRepository.update(id, customerData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
}
