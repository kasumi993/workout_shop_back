import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  streetAddress: string;

  @Column()
  country: string;

  @Column({ default: false })
  paid: boolean;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ nullable: true })
  paymentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
