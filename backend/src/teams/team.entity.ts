import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  game: string;

  @Column({ nullable: true })
  sport: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: 'open' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  captain: User;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];
}
