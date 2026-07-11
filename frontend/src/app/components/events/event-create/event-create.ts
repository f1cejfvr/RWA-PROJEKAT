import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { createEvent } from '../../../store/events.actions';

@Component({
  selector: 'app-event-create',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './event-create.html',
  styleUrl: './event-create.css',
})
export class EventCreate {
  title = '';
  description = '';
  type = 'casual';
  category = 'gaming';
  game = '';
  sport = '';
  city = '';
  location = '';
  maxPlayers = 2;
  date = '';

  constructor(private store: Store) {}

  onSubmit(): void {
    if (this.title && this.category && this.type) {
      this.store.dispatch(createEvent({
        data: {
          title: this.title,
          description: this.description,
          type: this.type,
          category: this.category,
          game: this.game || undefined,
          sport: this.sport || undefined,
          city: this.city || undefined,
          location: this.location || undefined,
          maxPlayers: this.maxPlayers,
          date: this.date ? new Date(this.date) : undefined,
        }
      }));
    }
  }
}