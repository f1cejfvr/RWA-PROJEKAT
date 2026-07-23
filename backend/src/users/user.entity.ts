import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ default: 'both' })
  type: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  matchesPlayed: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ nullable: true })
  city: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
}
