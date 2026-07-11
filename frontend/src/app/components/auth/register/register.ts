import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, AsyncPipe } from '@angular/common';
import { register } from '../../../store/auth.actions';
import { selectAuthError } from '../../../store/auth.selectors';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, NgIf, AsyncPipe],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  password = '';
  username = '';
  city = '';
  type = 'both';
  error$;

  constructor(private store: Store) {
    this.error$ = this.store.select(selectAuthError);
  }

  onSubmit(): void {
    if (this.email && this.password && this.username) {
      this.store.dispatch(register({
        email: this.email,
        password: this.password,
        username: this.username,
        city: this.city,
        type: this.type,
      }));
    }
  }
}