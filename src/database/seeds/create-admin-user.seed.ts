// src/database/seeds/create-admin-user.seed.ts
import { User } from '../../users/entities/user.entity';
import { Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';

export const createAdminUser = async (connection: Connection) => {
  const adminEmail = 'khadijag993@gmail.com';
  const userRepository = connection.getRepository(User);
  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const password = await bcrypt.hash('admin', 10);
    await userRepository.save({
      name: 'Admin User',
      email: adminEmail,
      password,
      isAdmin: true,
    });
    console.log('Admin user created');
  }
};
