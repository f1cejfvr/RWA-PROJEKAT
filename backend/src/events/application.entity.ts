import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from './event.entity';
import { Team } from '../teams/team.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'accepted', 'rejected'

  @Column({ nullable: true })
  message: string;

  @Column({ default: 'individual' })
  applicationType: string; // 'individual', 'team'

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  applicant: User;

  @ManyToOne(() => Event, { eager: true })
  event: Event;

  @ManyToOne(() => Team, { nullable: true, eager: true })
  team: Team;
}
