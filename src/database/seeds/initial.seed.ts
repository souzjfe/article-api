import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../app/users/entities/user.entity';
import { Permission } from '../../app/permissions/entities/permission.entity';
import * as bcrypt from 'bcrypt';

export default class InitialSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const permissionRepo = dataSource.getRepository(Permission);
    const userRepo = dataSource.getRepository(User);

    console.log('🌱 Seeding Permissions...');
    const permissions = [
      {
        name: 'Admin',
        description: 'Administrador total do sistema.',
      },
      {
        name: 'Editor',
        description: 'Pode gerenciar artigos.',
      },
      {
        name: 'Reader',
        description: 'Apenas leitura.',
      },
    ];

    for (const p of permissions) {
      const exists = await permissionRepo.findOneBy({ name: p.name });
      if (!exists) {
        await permissionRepo.save(p);
      }
    }

    console.log('👤 Seeding Root User...');
    const rootEmail = 'root@system.com';
    const rootUser = await userRepo.findOneBy({ email: rootEmail });

    if (!rootUser) {
      const adminPerm = await permissionRepo.findOneBy({ name: 'Admin' });
      if (adminPerm) {
        const password = await bcrypt.hash('root123', 10);
        await userRepo.save({
          name: 'Root User',
          email: rootEmail,
          password,
          permission: adminPerm,
        });
        console.log('✅ Root user created!');
      }
    } else {
      console.log('ℹ️ Root user already exists.');
    }
  }
}
