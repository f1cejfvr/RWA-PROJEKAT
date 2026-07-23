import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { TeamsService } from '../services/teams';
import {
  loadTeams, loadTeamsSuccess, loadTeamsFailure,
  loadTeam, loadTeamSuccess, loadTeamFailure,
  createTeam, createTeamSuccess, createTeamFailure,
  joinTeam, joinTeamSuccess, joinTeamFailure,
} from './teams.actions';

export class TeamsEffects {
  private actions$ = inject(Actions);
  private teamsService = inject(TeamsService);
  private router = inject(Router);

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTeams),
      switchMap(({ filters }) =>
        this.teamsService.getAll(filters).pipe(
          map((teams) => loadTeamsSuccess({ teams })),
          catchError((error) => of(loadTeamsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loadTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTeam),
      switchMap(({ id }) =>
        this.teamsService.getOne(id).pipe(
          map((team) => loadTeamSuccess({ team })),
          catchError((error) => of(loadTeamFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  createTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTeam),
      switchMap(({ data }) =>
        this.teamsService.create(data).pipe(
          map((team) => createTeamSuccess({ team })),
          catchError((error) => of(createTeamFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  createTeamSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createTeamSuccess),
        tap(() => this.router.navigate(['/teams'])),
      ),
    { dispatch: false },
  );

  joinTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(joinTeam),
      switchMap(({ teamId }) =>
        this.teamsService.requestToJoin(teamId).pipe(
          map((team) => joinTeamSuccess({ team })),
          catchError((error) => of(joinTeamFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}