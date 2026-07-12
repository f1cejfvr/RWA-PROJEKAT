import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { loadTeams } from '../../../store/teams.actions';
import { selectAllTeams, selectTeamsLoading } from '../../../store/teams.selectors';
import { Team } from '../../../models/team.model';
import { selectIsLoggedIn } from '../../../store/auth.selectors';

@Component({
  selector: 'app-team-list',
  imports: [AsyncPipe, NgIf, NgFor, RouterLink, FormsModule],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
})
export class TeamList implements OnInit, OnDestroy {
  teams$: Observable<Team[]>;
  loading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  private destroy$ = new Subject<void>();
  private citySearch$ = new Subject<string>();

  categoryFilter = '';
  cityFilter = '';

  constructor(private store: Store) {
    this.teams$ = this.store.select(selectAllTeams);
    this.loading$ = this.store.select(selectTeamsLoading);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  ngOnInit(): void {
    this.store.dispatch(loadTeams({}));

    this.citySearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe((city) => {
      this.store.dispatch(loadTeams({
        filters: {
          category: this.categoryFilter || undefined,
          city: city || undefined,
        }
      }));
    });
  }

  onCityInput(value: string): void {
    this.citySearch$.next(value);
  }

  applyFilters(): void {
    this.store.dispatch(loadTeams({
      filters: {
        category: this.categoryFilter || undefined,
        city: this.cityFilter || undefined,
      }
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}