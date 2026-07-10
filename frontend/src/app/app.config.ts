import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { authReducer } from './store/auth.reducer';
import { eventsReducer } from './store/events.reducer';
import { teamsReducer } from './store/teams.reducer';
import { AuthEffects } from './store/auth.effects';
import { EventsEffects } from './store/events.effects';
import { TeamsEffects } from './store/teams.effects';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      auth: authReducer,
      events: eventsReducer,
      teams: teamsReducer,
    }),
    provideEffects([AuthEffects, EventsEffects, TeamsEffects]),
    provideStoreDevtools({ maxAge: 25 }),
  ],
};