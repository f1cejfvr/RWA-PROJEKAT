import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  type: string; // 'tournament', 'casual'

  @Column()
  category: string; // 'gaming', 'sports'

  @Column({ nullable: true })
  game: string;

  @Column({ nullable: true })
  sport: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  maxPlayers: number;

  @Column({ default: 'open' })
  status: string; // 'open', 'full', 'completed'

  @Column({ nullable: true })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  organizer: User;
}
