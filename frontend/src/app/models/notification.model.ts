import { User } from './user.model';

export interface Notification {
  id: number;
  content: string;
  isRead: boolean;
  type: string;
  referenceId?: number;
  createdAt: Date;
  recipient: User;
}