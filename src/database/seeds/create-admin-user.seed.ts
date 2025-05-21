import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Customer } from '../../customers/entities/customer.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createAdminUser();
  }

  async createAdminUser() {
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') || 'khadijag993@gmail.com';
    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD') || 'admin';

    const existingAdmin = await this.customerRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await this.customerRepository.save({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });

      this.logger.log('Admin user created successfully');
    } else {
      this.logger.log('Admin user already exists');
    }
  }
}
