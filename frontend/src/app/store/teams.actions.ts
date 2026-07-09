import { createAction, props } from '@ngrx/store';
import { Team } from '../models/team.model';

export const loadTeams = createAction(
  '[Teams] Load Teams',
  props<{ filters?: { category?: string; city?: string } }>()
);

export const loadTeamsSuccess = createAction(
  '[Teams] Load Teams Success',
  props<{ teams: Team[] }>()
);

export const loadTeamsFailure = createAction(
  '[Teams] Load Teams Failure',
  props<{ error: string }>()
);

export const loadTeam = createAction(
  '[Teams] Load Team',
  props<{ id: number }>()
);

export const loadTeamSuccess = createAction(
  '[Teams] Load Team Success',
  props<{ team: Team }>()
);

export const loadTeamFailure = createAction(
  '[Teams] Load Team Failure',
  props<{ error: string }>()
);

export const createTeam = createAction(
  '[Teams] Create Team',
  props<{ data: Partial<Team> }>()
);

export const createTeamSuccess = createAction(
  '[Teams] Create Team Success',
  props<{ team: Team }>()
);

export const createTeamFailure = createAction(
  '[Teams] Create Team Failure',
  props<{ error: string }>()
);

export const joinTeam = createAction(
  '[Teams] Join Team',
  props<{ teamId: number }>()
);

export const joinTeamSuccess = createAction(
  '[Teams] Join Team Success',
  props<{ team: Team }>()
);

export const joinTeamFailure = createAction(
  '[Teams] Join Team Failure',
  props<{ error: string }>()
);
