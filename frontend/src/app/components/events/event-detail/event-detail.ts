import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf, DatePipe } from '@angular/common';
import { loadEvent, applyToEvent, createEvent } from '../../../store/events.actions';
import { selectSelectedEvent } from '../../../store/events.selectors';
import { selectUser } from '../../../store/auth.selectors';
import { Event } from '../../../models/event.model';
import { EventsService } from '../../../services/events';

@Component({
  selector: 'app-event-detail',
  imports: [AsyncPipe, NgIf, RouterLink, DatePipe],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetail implements OnInit {
  event$: Observable<Event | null>;
  user$: Observable<{ id: number; email: string; username: string } | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
  ) {
    this.event$ = this.store.select(selectSelectedEvent);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(loadEvent({ id: +id }));
    }
  }

  onApply(eventId: number): void {
    this.store.dispatch(applyToEvent({ eventId }));
  }

  onDelete(eventId: number): void {
    this.eventsService.remove(eventId).subscribe(() => {
      this.router.navigate(['/events']);
    });
  }
}