import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  getOne(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  update(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFriends(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${id}/friends`);
  }

  addFriend(userId: number, friendId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/friends/${friendId}`, {});
  }

  sendFriendRequest(userId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/${userId}/friend-request`, {});
}

getFriendRequests(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/friend-requests`);
}

respondToFriendRequest(requestId: number, status: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/friend-requests/${requestId}`, { status });
}

getSentFriendRequests(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/friend-requests/sent`);
}
}
