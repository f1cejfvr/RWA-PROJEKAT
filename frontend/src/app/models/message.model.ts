import { User } from './user.model';
import { Team } from './team.model';

export interface Message {
  id: number;
  content: string;
  createdAt: Date;
  sender: User;
  team: Team;
}
