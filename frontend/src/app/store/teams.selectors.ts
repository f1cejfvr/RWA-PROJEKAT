import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TeamsState, adapter } from './teams.reducer';

export const selectTeamsState = createFeatureSelector<TeamsState>('teams');

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectAllTeams = createSelector(selectTeamsState, selectAll);

export const selectTeamEntities = createSelector(selectTeamsState, selectEntities);

export const selectSelectedTeam = createSelector(
  selectTeamsState,
  (state) => state.selectedTeam,
);

export const selectTeamsError = createSelector(
  selectTeamsState,
  (state) => state.error,
);

export const selectTeamsLoading = createSelector(
  selectTeamsState,
  (state) => state.loading,
);
