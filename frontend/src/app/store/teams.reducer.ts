import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Team } from '../models/team.model';
import {
  loadTeamsSuccess,
  loadTeamsFailure,
  loadTeamSuccess,
  createTeamSuccess,
  joinTeamSuccess,
} from './teams.actions';

export interface TeamsState extends EntityState<Team> {
  selectedTeam: Team | null;
  error: string | null;
  loading: boolean;
}

export const adapter: EntityAdapter<Team> = createEntityAdapter<Team>();

export const initialState: TeamsState = adapter.getInitialState({
  selectedTeam: null,
  error: null,
  loading: false,
});

export const teamsReducer = createReducer(
  initialState,
  on(loadTeamsSuccess, (state, { teams }) => adapter.setAll(teams, { ...state, error: null })),
  on(loadTeamSuccess, (state, { team }) => ({ ...state, selectedTeam: team, error: null })),
  on(createTeamSuccess, (state, { team }) => adapter.addOne(team, state)),
  on(joinTeamSuccess, (state, { team }) => adapter.upsertOne(team, { ...state, selectedTeam: team })),
  on(loadTeamsFailure, (state, { error }) => ({ ...state, error })),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
