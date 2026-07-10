import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { EventsService } from '../services/events';
import {
  loadEvents, loadEventsSuccess, loadEventsFailure,
  loadEvent, loadEventSuccess, loadEventFailure,
  createEvent, createEventSuccess, createEventFailure,
  applyToEvent, applyToEventSuccess, applyToEventFailure,
} from './events.actions';

export class EventsEffects {
  private actions$ = inject(Actions);
  private eventsService = inject(EventsService);
  private router = inject(Router);

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEvents),
      switchMap(({ filters }) =>
        this.eventsService.getAll(filters).pipe(
          map((events) => loadEventsSuccess({ events })),
          catchError((error) => of(loadEventsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loadEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEvent),
      switchMap(({ id }) =>
        this.eventsService.getOne(id).pipe(
          map((event) => loadEventSuccess({ event })),
          catchError((error) => of(loadEventFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  createEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createEvent),
      switchMap(({ data }) =>
        this.eventsService.create(data).pipe(
          map((event) => createEventSuccess({ event })),
          catchError((error) => of(createEventFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  createEventSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createEventSuccess),
        tap(() => this.router.navigate(['/events'])),
      ),
    { dispatch: false },
  );

  applyToEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyToEvent),
      switchMap(({ eventId, message }) =>
        this.eventsService.apply(eventId, message).pipe(
          map((application) => applyToEventSuccess({ application })),
          catchError((error) => of(applyToEventFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}