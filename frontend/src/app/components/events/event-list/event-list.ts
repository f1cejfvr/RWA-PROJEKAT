import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { loadEvents } from '../../../store/events.actions';
import { selectAllEvents, selectEventsLoading } from '../../../store/events.selectors';
import { Event } from '../../../models/event.model';
import { selectIsLoggedIn } from '../../../store/auth.selectors';

@Component({
  selector: 'app-event-list',
  imports: [AsyncPipe, NgIf, NgFor, RouterLink, FormsModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList implements OnInit, OnDestroy {
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  categoryFilter = '';
  cityFilter = '';
  typeFilter = '';

  constructor(private store: Store) {
    this.events$ = this.store.select(selectAllEvents);
    this.loading$ = this.store.select(selectEventsLoading);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  ngOnInit(): void {
    this.store.dispatch(loadEvents({}));
  }

  applyFilters(): void {
    this.store.dispatch(loadEvents({
      filters: {
        category: this.categoryFilter || undefined,
        city: this.cityFilter || undefined,
        type: this.typeFilter || undefined,
      }
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}