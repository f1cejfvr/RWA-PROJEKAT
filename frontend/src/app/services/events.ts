import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, Application } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) {}

  getAll(filters?: { category?: string; city?: string; type?: string }): Observable<Event[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.city) params = params.set('city', filters.city);
    if (filters?.type) params = params.set('type', filters.type);
    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  getOne(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  apply(eventId: number, message?: string): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/${eventId}/apply`, { message });
  }

  getApplications(eventId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/${eventId}/applications`);
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/applications/${applicationId}/status`, { status });
  }
}