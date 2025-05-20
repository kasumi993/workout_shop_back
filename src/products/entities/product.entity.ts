// src/products/entities/product.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column('text', { array: true, default: [] })
  images: string[];

  @ManyToOne(() => Category, { nullable: true })
  category: Category | null;

  @Column({ type: 'jsonb', nullable: true })
  properties: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
