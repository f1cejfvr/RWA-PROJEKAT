import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Event } from '../models/event.model';
import {
  loadEventsSuccess,
  loadEventsFailure,
  loadEventSuccess,
  createEventSuccess,
} from './events.actions';

export interface EventsState extends EntityState<Event> {
  selectedEvent: Event | null;
  error: string | null;
  loading: boolean;
}

export const adapter: EntityAdapter<Event> = createEntityAdapter<Event>();

export const initialState: EventsState = adapter.getInitialState({
  selectedEvent: null,
  error: null,
  loading: false,
});

export const eventsReducer = createReducer(
  initialState,
  on(loadEventsSuccess, (state, { events }) => adapter.setAll(events, { ...state, error: null })),
  on(loadEventSuccess, (state, { event }) => ({ ...state, selectedEvent: event, error: null })),
  on(createEventSuccess, (state, { event }) => adapter.addOne(event, state)),
  on(loadEventsFailure, (state, { error }) => ({ ...state, error })),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
