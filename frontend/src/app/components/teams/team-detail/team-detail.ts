import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadTeam } from '../../../store/teams.actions';
import { selectSelectedTeam } from '../../../store/teams.selectors';
import { selectUser } from '../../../store/auth.selectors';
import { Team } from '../../../models/team.model';
import { TeamsService } from '../../../services/teams';
import { MessagesService } from '../../../services/messages';
import { Message } from '../../../models/message.model';

@Component({
  selector: 'app-team-detail',
  imports: [AsyncPipe, NgIf, NgFor, RouterLink, FormsModule],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.css',
})
export class TeamDetail implements OnInit {
  team$: Observable<Team | null>;
  user$: Observable<{ id: number; email: string; username: string } | null>;
  messages: Message[] = [];
  newMessage = '';
  isEditing = false;
  editData: Partial<Team> = {};
  joinRequestSent = false;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private teamsService: TeamsService,
    private messagesService: MessagesService,
    private cdr: ChangeDetectorRef,
  ) {
    this.team$ = this.store.select(selectSelectedTeam);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(loadTeam({ id: +id }));
      this.loadMessages(+id);
    }
  }

  loadMessages(teamId: number): void {
    this.messagesService.getTeamMessages(teamId).subscribe((messages) => {
      this.messages = messages;
      this.cdr.detectChanges();
    });
  }

  onJoin(teamId: number): void {
    this.teamsService.requestToJoin(teamId).subscribe(() => {
      this.joinRequestSent = true;
      this.cdr.detectChanges();
    });
  }

  onLeave(teamId: number, userId: number): void {
    this.teamsService.leaveTeam(teamId, userId).subscribe(() => {
      this.store.dispatch(loadTeam({ id: teamId }));
    });
  }

  onDelete(teamId: number): void {
    this.teamsService.remove(teamId).subscribe(() => {
      this.router.navigate(['/teams']);
    });
  }

  onEdit(team: Team): void {
    this.isEditing = true;
    this.editData = {
      name: team.name,
      description: team.description,
      city: team.city,
    };
  }

  onSaveEdit(teamId: number): void {
    this.teamsService.update(teamId, this.editData).subscribe(() => {
      this.isEditing = false;
      this.store.dispatch(loadTeam({ id: teamId }));
    });
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.editData = {};
  }

  sendMessage(teamId: number): void {
    if (this.newMessage.trim()) {
      this.messagesService.sendMessage(teamId, this.newMessage).subscribe((message) => {
        this.messages = [...this.messages, message];
        this.newMessage = '';
        this.cdr.detectChanges();
      });
    }
  }

  isMember(team: Team, userId: number): boolean {
    return team.members?.some((m) => m.id === userId) || false;
  }

  onToggleStatus(teamId: number, currentStatus: string): void {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    this.teamsService.update(teamId, { status: newStatus }).subscribe(() => {
      this.store.dispatch(loadTeam({ id: teamId }));
    });
  }
}