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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
