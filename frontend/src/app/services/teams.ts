import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private apiUrl = 'http://localhost:3000/teams';

  constructor(private http: HttpClient) {}

  getAll(filters?: { category?: string; city?: string }): Observable<Team[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.city) params = params.set('city', filters.city);
    return this.http.get<Team[]>(this.apiUrl, { params });
  }

  getOne(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Team>): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Team>): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  requestToJoin(teamId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teamId}/join-request`, {});
  }

  getJoinRequests(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${teamId}/join-requests`);
  }

  respondToJoinRequest(requestId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/join-requests/${requestId}`, { status });
  }

  leaveTeam(teamId: number, userId: number): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/members/${userId}`);
  }
}
