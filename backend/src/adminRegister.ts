import bcrypt from 'bcrypt';
import connectDB from './database';
import AdminUser from './models/Admin';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

async function registerAdminUser(email: string, password: string) {
  try {
    // Check if the admin user already exists
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const adminUser = new AdminUser({
      email,
      password: hashedPassword,
    });

    await adminUser.save();

    console.log('Admin user registered successfully');
  } catch (error) {
    console.error('Error registering admin user:', error);
  }
}

// Command-line argument parsing
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: ts-node registerAdmin.ts <email> <password>');
  process.exit(1);
}

const [email, password] = args;

// Connect to the database before registering the admin user
connectDB()
  .then(() => registerAdminUser(email, password))
  .then(() => {
    console.log('Process completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

// Example usage:
// ts-node adminRegister.ts admin@example.com AdminPassword123