import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SharedStore } from '@angular-module-federation-presentation/shared-data';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'df-root',
  template: `
    <nav>
      <ul class="remote-menu">
        <li><a routerLink="/">Home</a></li>
        <li><a routerLink="remote">Remote</a></li>
      </ul>
    </nav>

    <section>
      <h2>Shell</h2>
      <button (click)="addOne()">Add one</button>
      <p>Counter: {{ counter() }}</p>
    </section>
    
    <router-outlet/>

  `,
  styles: `
    :host {
      display: block;
    }

/* Top navigation */
  nav {
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: saturate(140%) blur(8px);
    background: rgba(10, 15, 30, 0.5);
    border-bottom: 1px solid var(--border);

    /* Full-bleed bar even when content is centered */
    width: 100vw;
    margin-left: calc(50% - 50vw);
  }

  nav .remote-menu {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px var(--space-5);
    margin: 0 auto;
    max-width: 1100px;
  }

  nav .remote-menu li a {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 8px;
    color: var(--text-0);
    opacity: 0.9;
    transition: background 0.2s ease, opacity 0.2s ease;
  }

  nav .remote-menu li a:hover {
    background: var(--surface-2);
    opacity: 1;
  }

  section {
    margin-inline: var(--space-6);
    margin-block: var(--space-6);
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-1);
    padding: var(--space-6);
  }

  section h2 {
    margin-bottom: var(--space-3);
    font-size: 18px;
    font-weight: 600;
  }

  section button {
    margin-inline-end: var(--space-3);
  }

  section p {
    display: inline-block;
    margin-left: var(--space-3);
    color: var(--text-1);
  }

  router-outlet {
    display: block;
    margin: var(--space-6) var(--space-5);
    border-top: 1px dashed var(--border);
    padding-top: var(--space-5);
  }
  `,
})
export class App {
  private readonly store = inject(SharedStore);
  counter = this.store.counter;

  addOne() {
    this.store.addOne();
  }
}
