import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CustomersService } from '../customers/customers.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Customer | null> {
    const user = await this.customersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'Access denied: Admin privileges required',
      );
    }

    // Create payload that matches JwtPayload interface
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
      },
    };
  }
}
