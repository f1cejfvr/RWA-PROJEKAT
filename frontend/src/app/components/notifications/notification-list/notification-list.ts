import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { NotificationsService } from '../../../services/notifications';
import { UsersService } from '../../../services/users';
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

  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadFriendRequests();
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

  deleteNotification(id: number): void {
    this.notificationsService.remove(id).subscribe(() => {
      this.loadNotifications();
    });
  }
}