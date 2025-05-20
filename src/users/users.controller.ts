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
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, userData);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
