import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { loadEvents } from '../../../store/events.actions';
import { selectAllEvents, selectEventsLoading } from '../../../store/events.selectors';
import { Event } from '../../../models/event.model';
import { selectIsLoggedIn } from '../../../store/auth.selectors';
import { EventsService } from '../../../services/events';

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
  private citySearch$ = new Subject<string>();

  categoryFilter = '';
  cityFilter = '';
  typeFilter = '';

  constructor(
    private store: Store,
    private eventsService: EventsService,
  ) {
    this.events$ = this.store.select(selectAllEvents);
    this.loading$ = this.store.select(selectEventsLoading);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  ngOnInit(): void {
    this.store.dispatch(loadEvents({}));

    this.eventsService.getAllWithFetch().then((events) => {
      console.log('Eventi ucitani via Fetch API:', events);
    }).catch((err) => {
      console.error('Greska pri Fetch API:', err);
    });

    this.eventsService.checkEventAvailability(1).then((available) => {
      console.log('Event dostupan:', available);
    }).catch((err) => {
      console.error('Greska pri Promise:', err);
    });

    this.citySearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe((city) => {
      this.store.dispatch(loadEvents({
        filters: {
          category: this.categoryFilter || undefined,
          city: city || undefined,
          type: this.typeFilter || undefined,
        }
      }));
    });
  }

  onCityInput(value: string): void {
    this.citySearch$.next(value);
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