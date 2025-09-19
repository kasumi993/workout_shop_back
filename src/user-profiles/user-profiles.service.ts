import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserProfile } from '@prisma/client';

export interface CreateUserProfileDto {
  userId: string; // Supabase auth.users.id
  name: string;
  email: string;
  image?: string;
}

export interface UpdateUserProfileDto {
  name?: string;
  image?: string;
}

@Injectable()
export class UserProfilesService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.prisma.userProfile.findUnique({
      where: { userId },
    });
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    return this.prisma.userProfile.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserProfileDto): Promise<UserProfile> {
    return this.prisma.userProfile.create({
      data,
    });
  }

  async update(userId: string, data: UpdateUserProfileDto): Promise<UserProfile> {
    return this.prisma.userProfile.update({
      where: { userId },
      data,
    });
  }

  async findOrCreate(data: CreateUserProfileDto): Promise<UserProfile> {
    const existing = await this.findByUserId(data.userId);

    if (existing) {
      return existing;
    }

    return this.create(data);
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.userProfile.delete({
      where: { userId },
    });
  }

  async findAll(): Promise<UserProfile[]> {
    return this.prisma.userProfile.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}