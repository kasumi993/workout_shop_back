import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'khadijag993@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123!@#';

  try {
    console.log('Setting up admin user...');

    // Create admin user
    const { data: adminUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        isAdmin: true,
        name: 'Admin User',
      },
    });

    if (createError) {
      if (createError.message.includes('already been registered')) {
        console.log('Admin user already exists. Updating metadata...');

        // Find the existing user
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
          throw listError;
        }

        const existingUser = users.users.find((user: any) => user.email === adminEmail);

        if (existingUser) {
          // Update user metadata to ensure admin status
          const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            {
              user_metadata: {
                isAdmin: true,
                name: 'Admin User',
              },
            }
          );

          if (updateError) {
            throw updateError;
          }

          console.log('✅ Admin user metadata updated successfully');
          console.log('Admin User ID:', existingUser.id);
          console.log('Admin Email:', existingUser.email);
        }
      } else {
        throw createError;
      }
    } else {
      console.log('✅ Admin user created successfully');
      console.log('Admin User ID:', adminUser.user.id);
      console.log('Admin Email:', adminUser.user.email);
    }

    console.log('\n🔑 Admin credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  setupAdminUser()
    .then(() => {
      console.log('\n✅ Admin setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export { setupAdminUser };