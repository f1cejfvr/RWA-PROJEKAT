import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationsService } from '../../../services/notifications';
import { UsersService } from '../../../services/users';
import { TeamsService } from '../../../services/teams';
import { Notification } from '../../../models/notification.model';

@Component({
  selector: 'app-notification-list',
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.css',
})
export class NotificationList implements OnInit {
  notifications: Notification[] = [];
  friendRequests: any[] = [];
  teamJoinRequests: any[] = [];

  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private teamsService: TeamsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    merge(
      this.notificationsService.getMyNotifications().pipe(
        tap((notifications) => {
          this.notifications = notifications;
          this.cdr.detectChanges();
        }),
      ),
      this.usersService.getFriendRequests().pipe(
        tap((requests) => {
          this.friendRequests = requests;
          this.cdr.detectChanges();
        }),
      ),
    ).subscribe();

    this.loadTeamJoinRequests();
  }

  loadTeamJoinRequests(): void {
    this.notificationsService.getMyNotifications().subscribe((notifications) => {
      const teamNotifications = notifications.filter((n) => n.type === 'team_join_request' && !n.isRead);
      if (teamNotifications.length > 0) {
        const teamIds = [...new Set(teamNotifications.map((n) => n.referenceId).filter(Boolean))];
        const requests: any[] = [];
        let loaded = 0;
        teamIds.forEach((teamId) => {
          this.teamsService.getJoinRequests(teamId!).subscribe((reqs) => {
            requests.push(...reqs);
            loaded++;
            if (loaded === teamIds.length) {
              this.teamJoinRequests = requests;
              this.cdr.detectChanges();
            }
          });
        });
      }
    });
  }

  loadNotifications(): void {
    this.notificationsService.getMyNotifications().subscribe((notifications) => {
      this.notifications = notifications;
      this.cdr.detectChanges();
    });
  }

  loadFriendRequests(): void {
    this.usersService.getFriendRequests().subscribe((requests) => {
      this.friendRequests = requests;
      this.cdr.detectChanges();
    });
  }

  markAsRead(id: number): void {
    this.notificationsService.markAsRead(id).subscribe(() => {
      this.loadNotifications();
    });
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe(() => {
      this.loadNotifications();
    });
  }

  respondToFriendRequest(requestId: number, status: string): void {
    this.usersService.respondToFriendRequest(requestId, status).subscribe(() => {
      this.loadFriendRequests();
    });
  }

  respondToTeamJoinRequest(requestId: number, status: string): void {
    this.teamsService.respondToJoinRequest(requestId, status).subscribe(() => {
      this.loadTeamJoinRequests();
      this.loadNotifications();
    });
  }

  deleteNotification(id: number): void {
    this.notificationsService.remove(id).subscribe(() => {
      this.loadNotifications();
    });
  }
}