import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, take } from 'rxjs/operators';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { selectUser } from '../../../store/auth.selectors';
import { UsersService } from '../../../services/users';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-search',
  imports: [NgIf, NgFor, FormsModule, RouterLink, AsyncPipe],
  templateUrl: './user-search.html',
  styleUrl: './user-search.css',
})
export class UserSearch implements OnInit, OnDestroy {
  users: User[] = [];
  searchQuery = '';
  friendAdded: { [key: number]: boolean } = {};
  currentUser$: Observable<{ id: number; email: string; username: string } | null>;
  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();

  constructor(
    private usersService: UsersService,
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentUser$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.usersService.getAll().subscribe((users) => {
      this.users = users;
      this.cdr.detectChanges();
    });

    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe((query) => {
      this.usersService.getAll().subscribe((users) => {
        this.users = users.filter((u) =>
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.city?.toLowerCase().includes(query.toLowerCase()),
        );
        this.cdr.detectChanges();
      });
    });
  }

  onSearch(query: string): void {
    this.search$.next(query);
  }

  addFriend(userId: number): void {
    this.usersService.sendFriendRequest(userId).subscribe(() => {
      this.friendAdded[userId] = true;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}