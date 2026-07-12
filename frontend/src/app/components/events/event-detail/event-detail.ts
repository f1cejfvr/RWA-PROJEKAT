import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadEvent, applyToEvent } from '../../../store/events.actions';
import { selectSelectedEvent } from '../../../store/events.selectors';
import { selectUser } from '../../../store/auth.selectors';
import { Event } from '../../../models/event.model';
import { EventsService } from '../../../services/events';

@Component({
  selector: 'app-event-detail',
  imports: [AsyncPipe, NgIf, RouterLink, DatePipe, FormsModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetail implements OnInit {
  event$: Observable<Event | null>;
  user$: Observable<{ id: number; email: string; username: string } | null>;
  isEditing = false;
  editData: Partial<Event> = {};

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

  onEdit(event: Event): void {
    this.isEditing = true;
    this.editData = {
      title: event.title,
      description: event.description,
      city: event.city,
      location: event.location,
      maxPlayers: event.maxPlayers,
    };
  }

  onSaveEdit(eventId: number): void {
    this.eventsService.update(eventId, this.editData).subscribe(() => {
      this.isEditing = false;
      this.store.dispatch(loadEvent({ id: eventId }));
    });
  }

  onCloseApplications(eventId: number): void {
    this.eventsService.update(eventId, { status: 'full' }).subscribe(() => {
      this.store.dispatch(loadEvent({ id: eventId }));
    });
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.editData = {};
  }

  onToggleApplications(eventId: number, currentStatus: string): void {
  const newStatus = currentStatus === 'open' ? 'full' : 'open';
  this.eventsService.update(eventId, { status: newStatus }).subscribe(() => {
    this.store.dispatch(loadEvent({ id: eventId }));
  });
}
}