import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'df-remote-ce-page',
  template: `
    <section>
      <h2>Remote (Custom Element)</h2>
      <df-remote-widget></df-remote-widget>
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

  // private readonly appRef = inject(ApplicationRef);
  // private readonly environmentInjector = inject(EnvironmentInjector);

  async ngOnInit(): Promise<void> {
    const mod = await import('remote/Elements');
    const register = (mod as Record<string, unknown>)['register'] as (() => Promise<void>);
    if (typeof register === 'function') {
      await register();
    }
  }
}


