import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Team } from './team.entity';

@Entity()
export class TeamJoinRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  applicant: User;

  @ManyToOne(() => Team, { eager: true })
  team: Team;
}
