import { Injectable,  signal } from '@angular/core';

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class SharedStore {

  counter = signal(0);

  addOne() {
    this.counter.update(c => c + 1);
  }
}


