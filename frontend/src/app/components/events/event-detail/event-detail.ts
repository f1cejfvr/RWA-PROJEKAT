import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { AsyncPipe, NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { loadEvent, applyToEvent, applyToEventSuccess } from '../../../store/events.actions';
import { selectSelectedEvent } from '../../../store/events.selectors';
import { selectUser } from '../../../store/auth.selectors';
import { Event, Application } from '../../../models/event.model';
import { EventsService } from '../../../services/events';
import { TeamsService } from '../../../services/teams';
import { Team } from '../../../models/team.model';

@Component({
  selector: 'app-event-detail',
  imports: [AsyncPipe, NgIf, NgFor, RouterLink, DatePipe, FormsModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetail implements OnInit, OnDestroy {
  event$: Observable<Event | null>;
  user$: Observable<{ id: number; email: string; username: string } | null>;
  isEditing = false;
  editData: Partial<Event> = {};
  myTeams: Team[] = [];
  selectedTeamId: number | null = null;
  applySuccess = false;
  applications: Application[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private teamsService: TeamsService,
    private actions$: Actions,
  ) {
    this.event$ = this.store.select(selectSelectedEvent);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(loadEvent({ id: +id }));
    }

    this.event$.pipe(
      filter((event) => !!event),
      takeUntil(this.destroy$),
    ).subscribe((event) => {
      if (event) {
        this.eventsService.getApplications(event.id).subscribe((apps) => {
          this.applications = apps;
        });
      }
    });

    this.teamsService.getAll().subscribe((teams) => {
      this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
        if (user) {
          this.myTeams = teams.filter((t) => t.captain?.id === user.id);
        }
      });
    });

    this.actions$.pipe(
      ofType(applyToEventSuccess),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.applySuccess = true;
      setTimeout(() => this.applySuccess = false, 3000);
    });
  }

  onApply(eventId: number): void {
    this.store.dispatch(applyToEvent({
      eventId,
      teamId: this.selectedTeamId || undefined,
    }));
  }

  onDelete(eventId: number): void {
    this.eventsService.remove(eventId).subscribe(() => {
      this.router.navigate(['/events']);
    });
  }

  onEdit(event: Event): void {
    this.isEditing = true;
    this.editData = {
      title: event.title,
      description: event.description,
      city: event.city,
      location: event.location,
      maxPlayers: event.maxPlayers,
    };
  }

  onSaveEdit(eventId: number): void {
    this.eventsService.update(eventId, this.editData).subscribe(() => {
      this.isEditing = false;
      this.store.dispatch(loadEvent({ id: eventId }));
    });
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.editData = {};
  }

  onToggleApplications(eventId: number, currentStatus: string): void {
    const newStatus = currentStatus === 'open' ? 'full' : 'open';
    this.eventsService.update(eventId, { status: newStatus }).subscribe(() => {
      this.store.dispatch(loadEvent({ id: eventId }));
    });
  }

  updateAppStatus(applicationId: number, status: string): void {
    this.eventsService.updateApplicationStatus(applicationId, status).subscribe(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.eventsService.getApplications(+id).subscribe((apps) => {
          this.applications = apps;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}