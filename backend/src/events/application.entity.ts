import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from './event.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'accepted', 'rejected'

  @Column({ nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  applicant: User;

  @ManyToOne(() => Event, { eager: true })
  event: Event;
}
