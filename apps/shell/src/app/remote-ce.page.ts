import { SharedStore } from '@angular-module-federation-presentation/shared-data';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'df-remote-ce-page',
  template: `
    <section>
      <h2>Remote (Custom Element)</h2>
      <df-remote-widget
        [attr.counterfromshell]="counter()"
        (counterchange)="onRemoteCounter($event)"
      ></df-remote-widget>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles:
    `
      h2 {
        margin-inline: var(--space-6);
      }
    `
})
export class RemoteCePage implements OnInit {

  private sharedStore = inject(SharedStore);
  counter = this.sharedStore.counter;

  async ngOnInit(): Promise<void> {
    const mod = await import('remote/Elements');
    const register = (mod as Record<string, unknown>)['register'] as (() => Promise<void>);
    if (typeof register === 'function') {
      await register();
    }
  }

  onRemoteCounter(e: CustomEvent<number>) {
    this.sharedStore.counter.set(e.detail);
  }
}


