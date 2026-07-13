import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AsyncPipe, NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { applyToEvent, applyToEventSuccess } from '../../../store/events.actions';
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
  event: Event | null = null;
  user$: Observable<{ id: number; email: string; username: string } | null>;
  isEditing = false;
  editData: Partial<Event> = {};
  myTeams: Team[] = [];
  selectedTeamId: number | null = null;
  applySuccess = false;
  applications: Application[] = [];
  applicationFilter = 'all';
  private destroy$ = new Subject<void>();
  private eventId: number = 0;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private teamsService: TeamsService,
    private actions$: Actions,
    private cdr: ChangeDetectorRef,
  ) {
    this.user$ = this.store.select(selectUser);
  }

  get filteredApplications(): Application[] {
    if (this.applicationFilter === 'all') return this.applications;
    return this.applications.filter((a) => a.status === this.applicationFilter);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventId = +id;
      this.loadEvent();
      this.loadApplications();
    }

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
      this.loadApplications();
      setTimeout(() => (this.applySuccess = false), 3000);
    });
  }

  loadEvent(): void {
    this.eventsService.getOne(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading event:', err);
      },
    });
  }

  loadApplications(): void {
    this.eventsService.getApplications(this.eventId).subscribe((apps) => {
      this.applications = apps.sort((a, b) => {
        const order = { pending: 0, accepted: 1, rejected: 2 };
        return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
      });
      this.cdr.detectChanges();
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
      this.loadEvent();
    });
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.editData = {};
  }

  onToggleApplications(eventId: number, currentStatus: string): void {
    const newStatus = currentStatus === 'open' ? 'full' : 'open';
    this.eventsService.update(eventId, { status: newStatus }).subscribe(() => {
      this.loadEvent();
    });
  }

  updateAppStatus(applicationId: number, status: string): void {
    this.eventsService.updateApplicationStatus(applicationId, status).subscribe(() => {
      this.loadApplications();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}