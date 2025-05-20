import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  providers: [],
  exports: [],
})
export class SeedModule {}
