import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import * as bcrypt from 'bcrypt';
import { CustomersService } from '../customers/customers.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt.interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'Access denied: Admin privileges required',
      );
    }

    // Create payload that matches JwtPayload interface
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      isAdmin: user.isAdmin,
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

  async googleLogin(googleAuthDto: GoogleAuthDto) {
    const { email, name, image, googleId } = googleAuthDto;

    try {
      // First, check if user exists with this email
      let customer = await this.prisma.customer.findUnique({
        where: { email },
      });

      if (customer) {
        // User exists, update their Google ID and image if not set
        customer = await this.prisma.customer.update({
          where: { email },
          data: {
            googleId: googleId,
            image: customer.image || image,
            name: customer.name || name,
          },
        });
      } else {
        // Create new customer with Google data
        // Check if this email is in the admin whitelist
        const adminEmails =
          this.configService.get<string>('ADMIN_EMAILS')?.split(',') || [];
        const isAdmin = adminEmails.includes(email);

        customer = await this.prisma.customer.create({
          data: {
            email,
            name,
            image,
            googleId,
            isAdmin,
            // Set a random password since they're using Google auth
            password: await bcrypt.hash(Math.random().toString(36), 10),
          },
        });
      }

      // Check if user is admin
      if (!customer.isAdmin) {
        throw new UnauthorizedException(
          'Access denied. Admin privileges required.',
        );
      }

      // Generate JWT token
      const payload = {
        email: customer.email,
        sub: customer.id,
        isAdmin: customer.isAdmin,
      };

      return {
        user: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          image: customer.image,
          isAdmin: customer.isAdmin,
        },
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}
