import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth';
import { login, loginSuccess, loginFailure, register, registerSuccess, registerFailure, logout } from './auth.actions';

export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map((response) => loginSuccess({ token: response.access_token, user: response.user })),
          catchError((error) => of(loginFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      switchMap(({ email, password, username, city, type }) =>
        this.authService.register({ email, password, username, city, type }).pipe(
          map((response) => registerSuccess({ token: response.access_token, user: response.user })),
          catchError((error) => of(registerFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess, registerSuccess),
        tap(() => this.router.navigate(['/'])),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}