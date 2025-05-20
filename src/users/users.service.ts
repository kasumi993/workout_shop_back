import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    // Hash the password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.findOne(id); // Verify user exists

    // Hash the password if it's being updated
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
