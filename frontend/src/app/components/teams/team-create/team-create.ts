import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { createTeam } from '../../../store/teams.actions';

@Component({
  selector: 'app-team-create',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './team-create.html',
  styleUrl: './team-create.css',
})
export class TeamCreate {
  name = '';
  description = '';
  category = 'gaming';
  game = '';
  sport = '';
  city = '';

  constructor(private store: Store) {}

  onSubmit(): void {
    if (this.name && this.category) {
      this.store.dispatch(createTeam({
        data: {
          name: this.name,
          description: this.description,
          category: this.category,
          game: this.game || undefined,
          sport: this.sport || undefined,
          city: this.city || undefined,
        }
      }));
    }
  }
}