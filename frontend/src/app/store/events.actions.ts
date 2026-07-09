import { createAction, props } from '@ngrx/store';
import { Event, Application } from '../models/event.model';

export const loadEvents = createAction(
  '[Events] Load Events',
  props<{ filters?: { category?: string; city?: string; type?: string } }>()
);

export const loadEventsSuccess = createAction(
  '[Events] Load Events Success',
  props<{ events: Event[] }>()
);

export const loadEventsFailure = createAction(
  '[Events] Load Events Failure',
  props<{ error: string }>()
);

export const loadEvent = createAction(
  '[Events] Load Event',
  props<{ id: number }>()
);

export const loadEventSuccess = createAction(
  '[Events] Load Event Success',
  props<{ event: Event }>()
);

export const loadEventFailure = createAction(
  '[Events] Load Event Failure',
  props<{ error: string }>()
);

export const createEvent = createAction(
  '[Events] Create Event',
  props<{ data: Partial<Event> }>()
);

export const createEventSuccess = createAction(
  '[Events] Create Event Success',
  props<{ event: Event }>()
);

export const createEventFailure = createAction(
  '[Events] Create Event Failure',
  props<{ error: string }>()
);

export const applyToEvent = createAction(
  '[Events] Apply To Event',
  props<{ eventId: number; message?: string }>()
);

export const applyToEventSuccess = createAction(
  '[Events] Apply To Event Success',
  props<{ application: Application }>()
);

export const applyToEventFailure = createAction(
  '[Events] Apply To Event Failure',
  props<{ error: string }>()
);
