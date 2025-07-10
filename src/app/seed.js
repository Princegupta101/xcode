import bcrypt from 'bcrypt';

import connectDB from '../lib/db';
import { Admin, Listing } from '../lib/models';

export async function seed() {
  try {
    await connectDB();

    await Admin.deleteMany({});
    await Admin.create({
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 10),
    });

    await Listing.deleteMany({});
    await Listing.create([
      {
        title: 'Toyota Camry',
        description: '2020 model, low mileage',
        price: 50.0,
        status: 'pending',
      },
      {
        title: 'Honda Civic',
        description: '2019 model, well maintained',
        price: 45.0,
        status: 'pending',
      },
    ]);

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}
