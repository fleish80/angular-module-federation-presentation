import RemoteEntry from './entry.component';
import { createApplication } from '@angular/platform-browser';
import {
  ApplicationRef,
  EnvironmentInjector,
  ComponentRef,
  createComponent,
  provideZonelessChangeDetection,
} from '@angular/core';

export const REMOTE_CE_TAG = 'df-remote-widget';

export async function register(): Promise<void> {
  if (customElements.get(REMOTE_CE_TAG)) return;

  const app = await createApplication({
    providers: [provideZonelessChangeDetection()],
  });
  const environmentInjector = app.injector.get(EnvironmentInjector);
  const appRef = app.injector.get(ApplicationRef);

  class RemoteWidgetElement extends HTMLElement {
    private componentRef: ComponentRef<RemoteEntry> | null = null;
    connectedCallback(): void {
      if (this.componentRef) return;
      this.componentRef = createComponent(RemoteEntry, {
        hostElement: this,
        environmentInjector,
      });
      appRef.attachView(this.componentRef.hostView);
      this.componentRef.changeDetectorRef.detectChanges();
    }
    disconnectedCallback(): void {
      if (this.componentRef) {
        appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
        this.componentRef = null;
      }
    }
  }

  customElements.define(REMOTE_CE_TAG, RemoteWidgetElement);
}

export default register;


