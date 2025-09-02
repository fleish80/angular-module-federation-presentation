import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
export class RemoteCePage {}


