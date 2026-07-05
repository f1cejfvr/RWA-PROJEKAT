export interface User {
  id: number;
  email: string;
  username: string;
  bio?: string;
  type: string;
  rating: number;
  matchesPlayed: number;
  wins: number;
  city?: string;
  createdAt: Date;
  friends?: User[];
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}