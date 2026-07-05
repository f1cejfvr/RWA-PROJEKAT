export interface Event {
  id: number;
  title: string;
  description?: string;
  type: string; // 'tournament', 'casual'
  category: string; // 'gaming', 'sports'
  game?: string;
  sport?: string;
  city?: string;
  location?: string;
  maxPlayers: number;
  status: string;
  date?: Date;
  createdAt: Date;
  organizer: {
    id: number;
    email: string;
    username: string;
  };
}

export interface Application {
  id: number;
  status: string;
  message?: string;
  createdAt: Date;
  applicant: {
    id: number;
    email: string;
    username: string;
  };
  event: Event;
}