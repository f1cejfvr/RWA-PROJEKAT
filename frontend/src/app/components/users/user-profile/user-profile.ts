import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { selectUser } from '../../../store/auth.selectors';
import { UsersService } from '../../../services/users';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-profile',
  imports: [AsyncPipe, NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  user$: Observable<{ id: number; email: string; username: string } | null>;
  profile: User | null = null;
  friends: User[] = [];
  isEditing = false;
  editData: Partial<User> = {};

  constructor(
    private store: Store,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.usersService.getOne(user.id).subscribe((profile) => {
          this.profile = profile;
          this.cdr.detectChanges();
        });
        this.usersService.getFriends(user.id).subscribe((friends) => {
          this.friends = friends;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onEdit(): void {
    if (this.profile) {
      this.isEditing = true;
      this.editData = {
        username: this.profile.username,
        bio: this.profile.bio,
        city: this.profile.city,
        type: this.profile.type,
      };
    }
  }

  onSave(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.usersService.update(user.id, this.editData).subscribe((profile) => {
          this.profile = profile;
          this.isEditing = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onCancel(): void {
    this.isEditing = false;
    this.editData = {};
  }
}