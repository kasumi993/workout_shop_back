import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['items', 'items.product', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'customer'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Create new order
    const order = this.ordersRepository.create({
      name: createOrderDto.name,
      email: createOrderDto.email,
      city: createOrderDto.city,
      postalCode: createOrderDto?.postalCode,
      streetAddress: createOrderDto?.streetAddress,
      country: createOrderDto?.country,
      paid: false,
    });

    // Associate with user if provided
    if (createOrderDto?.customerId) {
      order.customer = await this.customersService.findOne(
        createOrderDto.customerId,
      );
    }

    // Calculate total and create order items
    let total = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto?.items ?? []) {
      if (!item?.productId) {
        throw new Error('Product ID is required for order items');
      }
      const product = await this.productsService.findOne(item.productId);

      const orderItem = this.orderItemsRepository.create({
        product,
        quantity: item?.quantity,
        price: product.price,
      });

      total += product.price * item?.quantity;
      orderItems.push(orderItem);
    }

    order.total = total;

    // Save order first to get ID
    const savedOrder = await this.ordersRepository.save(order);

    // Associate order items with the order and save them
    for (const item of orderItems) {
      item.order = savedOrder;
      await this.orderItemsRepository.save(item);
    }

    // Fetch complete order with items
    return this.findOne(savedOrder.id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Update basic fields
    if (updateOrderDto.name) order.name = updateOrderDto.name;
    if (updateOrderDto.email) order.email = updateOrderDto.email;
    if (updateOrderDto.city) order.city = updateOrderDto.city;
    if (updateOrderDto.postalCode) order.postalCode = updateOrderDto.postalCode;
    if (updateOrderDto.streetAddress)
      order.streetAddress = updateOrderDto.streetAddress;
    if (updateOrderDto.country) order.country = updateOrderDto.country;
    if (updateOrderDto.paid !== undefined) order.paid = updateOrderDto.paid;
    if (updateOrderDto.paymentId) order.paymentId = updateOrderDto.paymentId;

    // Save the updated order
    await this.ordersRepository.save(order);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);

    // Delete associated order items
    if (order.items && order.items.length > 0) {
      await this.orderItemsRepository.remove(order.items);
    }

    // Delete the order
    await this.ordersRepository.remove(order);
  }
}
