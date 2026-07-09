import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventsState, adapter } from './events.reducer';

export const selectEventsState = createFeatureSelector<EventsState>('events');

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectAllEvents = createSelector(selectEventsState, selectAll);

export const selectEventEntities = createSelector(selectEventsState, selectEntities);

export const selectSelectedEvent = createSelector(
  selectEventsState,
  (state) => state.selectedEvent,
);

export const selectEventsError = createSelector(
  selectEventsState,
  (state) => state.error,
);

export const selectEventsLoading = createSelector(
  selectEventsState,
  (state) => state.loading,
);
