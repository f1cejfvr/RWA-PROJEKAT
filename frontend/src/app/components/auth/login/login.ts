import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, AsyncPipe } from '@angular/common';
import { login } from '../../../store/auth.actions';
import { selectAuthError } from '../../../store/auth.selectors';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, NgIf, AsyncPipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  error$;

  constructor(private store: Store) {
    this.error$ = this.store.select(selectAuthError);
  }

  onSubmit(): void {
    if (this.email && this.password) {
      this.store.dispatch(login({ email: this.email, password: this.password }));
    }
  }
}
