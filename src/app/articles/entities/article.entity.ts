import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('json')
  content: Record<string, unknown>;

  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  author: User;
}
