import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import { User } from '../app/users/entities/user.entity';
import { Article } from '../app/articles/entities/article.entity';
import { Permission } from '../app/permissions/entities/permission.entity';

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'article_db'),
  entities: [User, Article, Permission],
  migrations: ['src/database/migrations/*.ts'],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  synchronize: false,
};

export const AppDataSource = new DataSource(options);
