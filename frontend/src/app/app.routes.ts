import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { EventList } from './components/events/event-list/event-list';
import { EventDetail } from './components/events/event-detail/event-detail';
import { EventCreate } from './components/events/event-create/event-create';
import { TeamList } from './components/teams/team-list/team-list';
import { TeamDetail } from './components/teams/team-detail/team-detail';
import { TeamCreate } from './components/teams/team-create/team-create';
import { UserProfile } from './components/users/user-profile/user-profile';
import { UserSearch } from './components/users/user-search/user-search';
import { NotificationList } from './components/notifications/notification-list/notification-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'events', component: EventList },
  { path: 'events/create', component: EventCreate, canActivate: [authGuard] },
  { path: 'events/:id', component: EventDetail },
  { path: 'teams', component: TeamList },
  { path: 'teams/create', component: TeamCreate, canActivate: [authGuard] },
  { path: 'teams/:id', component: TeamDetail },
  { path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: 'users', component: UserSearch },
  { path: 'notifications', component: NotificationList, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
