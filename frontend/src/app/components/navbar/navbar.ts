import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { selectIsLoggedIn, selectUser } from '../../store/auth.selectors';
import { logout } from '../../store/auth.actions';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn$: Observable<boolean>;
  user$: Observable<{ id: number; email: string; username: string } | null>;

  constructor(private store: Store, private router: Router) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {}

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
