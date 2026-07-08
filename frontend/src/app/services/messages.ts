import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private apiUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {}

  getTeamMessages(teamId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/team/${teamId}`);
  }

  sendMessage(teamId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/team/${teamId}`, { content });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}