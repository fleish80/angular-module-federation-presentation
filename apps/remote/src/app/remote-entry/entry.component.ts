import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SharedStore } from '@angular-module-federation-presentation/shared-data';

@Component({
  standalone: true,
  imports: [],
  selector: 'df-remote-entry',
  template: `
    <section>
      <h2>Remote</h2>
      <button (click)="addOne()">Add one</button>
      <p class="counter">Counter: {{ counter() }}</p>
      @if (counterFromShell()) {
        <p class="counter">Counter from Shell: {{ counterFromShell() }}</p>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles:
    `
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
  `
})
export default class RemoteEntry {

  private readonly store = inject(SharedStore);
  counter = this.store.counter;
  counterFromShell = input<number>();

  addOne() {
    this.store.addOne();
  }
}
