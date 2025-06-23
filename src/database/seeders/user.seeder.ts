import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../users/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum';
import { Status } from '../../common/enums/status.enum';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Check if an admin user already exists
    const existingAdmin = await userRepository.findOneBy({ email: 'admin@example.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('superadmin@123', 10);

      const adminUser = userRepository.create({
        username: 'super',
        email: 'superadmin@gmail.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'SuperAdmin',
        role: Role.SUPER_ADMIN,
        status: Status.ACTIVE,
      });

      await userRepository.save(adminUser);
      console.log('Admin user seeded successfully.');
    } else {
      console.log('Admin user already exists. Skipping seeding.');
    }
  }
}