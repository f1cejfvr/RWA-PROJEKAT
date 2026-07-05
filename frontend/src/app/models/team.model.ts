import { User } from './user.model';

export interface Team {
  id: number;
  name: string;
  description?: string;
  category: string;
  game?: string;
  sport?: string;
  city?: string;
  status: string;
  createdAt: Date;
  captain: {
    id: number;
    email: string;
    username: string;
  };
  members: User[];
}