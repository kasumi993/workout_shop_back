import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      items,
      customerId,
    } = createOrderDto;

    // Calculate total and prepare order items
    let total = 0;
    const orderItems: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of items || []) {
      if (!item?.productId) {
        throw new Error('Product ID is required for order items');
      }

      // Get product to get its price
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      total += product.price.toNumber() * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order with items in a transaction
    return this.prisma.order.create({
      data: {
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        paid: false,
        total,
        customer: customerId ? { connect: { id: customerId } } : undefined,
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Verify order exists
    await this.findOne(id);

    const {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      paid,
      paymentId,
    } = updateOrderDto;

    const data: Prisma.OrderUpdateInput = {};

    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (city !== undefined) data.city = city;
    if (postalCode !== undefined) data.postalCode = postalCode;
    if (streetAddress !== undefined) data.streetAddress = streetAddress;
    if (country !== undefined) data.country = country;
    if (paid !== undefined) data.paid = paid;
    if (paymentId !== undefined) data.paymentId = paymentId;

    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    // Verify order exists
    await this.findOne(id);

    // Prisma will automatically delete related OrderItems because of the cascade delete
    await this.prisma.order.delete({
      where: { id },
    });
  }
}
