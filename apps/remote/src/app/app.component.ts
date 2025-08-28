import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'df-app',
  imports: [RouterOutlet],
  template: `
    <h1>Remote App</h1>
    <router-outlet />
  `,
})
export class AppComponent {}