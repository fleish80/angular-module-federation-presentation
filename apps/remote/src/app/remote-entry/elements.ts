import RemoteEntry from './entry.component';
import { createApplication } from '@angular/platform-browser';
import {
  ApplicationRef,
  EnvironmentInjector,
  ComponentRef,
  createComponent,
  provideZonelessChangeDetection,
  effect,
  runInInjectionContext,
  EffectRef,
  afterNextRender,
} from '@angular/core';
import { SharedStore } from '@angular-module-federation-presentation/shared-data';

/**
 * Custom Element wrapper for the remote Angular component.
 *
 * This file exposes an imperative `register()` API that defines a web component
 * (`df-remote-widget`) at runtime. The element embeds an Angular standalone
 * component (`RemoteEntry`) and provides a framework-agnostic contract:
 *
 * - Input via attribute: `counterfromshell` (string → number)
 * - Output via DOM CustomEvent: `counterchange` (detail: number, bubbles, composed)
 *
 * Internally, it bridges the DOM world and Angular Signals:
 * - Reads the attribute and writes it to the shared signal store
 * - Listens to the shared signal and re-emits changes as a DOM event
 *
 * The Angular app runs zone-less for better performance and clean signal updates.
 */
export const REMOTE_CE_TAG = 'df-remote-widget';
/** Attribute name consumed by the CE for incoming counter value (from host). */
const ATTR_COUNTER_FROM_SHELL = 'counterfromshell';
/** Event name emitted by the CE when the counter changes. */
const EVENT_COUNTER_CHANGE = 'counterchange';

/**
 * Defines the Custom Element once per page load.
 *
 * Idempotent: safe to call multiple times. Creates a lightweight Angular
 * application context (zone-less) to host the standalone `RemoteEntry`.
 */
export async function register(): Promise<void> {

  // Avoid redefining the same tag if `register()` is called repeatedly.
  if (customElements.get(REMOTE_CE_TAG)) return;

  const app = await createApplication({
    providers: [provideZonelessChangeDetection()],
  });
  // Resolve core Angular services from the app-level injector.
  const environmentInjector = app.injector.get(EnvironmentInjector);
  const sharedStore = environmentInjector.get(SharedStore);
  const appRef = app.injector.get(ApplicationRef);

  class RemoteWidgetElement extends HTMLElement {

    private componentRef: ComponentRef<RemoteEntry> | null = null;
    private counterEffect: EffectRef | null = null;
    
    /**
     * Read the CE attribute and sync it into the shared signal store.
     *
     * - Parses the attribute as a number (NaN becomes a number that won't match
     *   any valid state, so the guard still applies)
     * - Schedules the write after the component's first render to avoid racing
     *   view initialization
     */
    private syncCounterFromAttribute(attrValue: string | null): void {
      runInInjectionContext(environmentInjector, () => {
        const next = Number(attrValue);
        afterNextRender(() => {
          if (sharedStore.counter() !== next) {
            sharedStore.counter.set(next);
          }
        });
      });
    }

    /**
     * Start an Angular effect that observes the signal and re-emits changes as
     * a DOM CustomEvent. The event is configured to:
     * - bubble (so listeners can be attached higher in the DOM)
     * - cross shadow DOM boundaries (composed)
     */
    private startCounterEffect(): void {
      runInInjectionContext(environmentInjector, () => {
        this.counterEffect = effect(() => {
          if (!this.componentRef) return;
          const value = this.componentRef.instance.counter();
          this.dispatchEvent(new CustomEvent<number>(EVENT_COUNTER_CHANGE, {
            detail: value,
            bubbles: true,
            composed: true,
          }));
        });
      });
    }
    
    /**
     * Declare which attributes the Custom Element reacts to.
     * This enables `attributeChangedCallback` for the listed names.
     */
    static get observedAttributes(): string[] {
      return [ATTR_COUNTER_FROM_SHELL];
    }
  
    /**
     * CE lifecycle: called when the element is connected to the document.
     *
     * - Creates the Angular component and attaches its view
     * - Hydrates the shared store from the initial attribute
     * - Starts the signal → DOM event bridge
     */
    connectedCallback(): void {
      if (this.componentRef) return;
      this.componentRef = createComponent(RemoteEntry, {
        hostElement: this,
        environmentInjector,
      });
      appRef.attachView(this.componentRef.hostView);
      const initialCounterFromShell = this.getAttribute(ATTR_COUNTER_FROM_SHELL);
      this.syncCounterFromAttribute(initialCounterFromShell);
      this.startCounterEffect();
      this.componentRef.changeDetectorRef.detectChanges();
    }
    /**
     * CE lifecycle: called for observed attribute changes.
     *
     * We map the attribute value into the shared signal store so Angular and
     * any other consumers stay in sync with the host-provided value.
     */
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
      if (!this.componentRef) return;
      if (name === ATTR_COUNTER_FROM_SHELL) {
        this.syncCounterFromAttribute(newValue);
      }
    }
    /**
     * CE lifecycle: called when the element is disconnected.
     *
     * Perform full cleanup:
     * - Detach and destroy the Angular component
     * - Tear down the running effect to stop dispatching events
     */
    disconnectedCallback(): void {
      if (this.componentRef) {
        appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
        this.componentRef = null;
      }
      this.counterEffect?.destroy();
      this.counterEffect = null;
    }
  }

  // Register the element globally so hosts can use <df-remote-widget> in any framework.
  customElements.define(REMOTE_CE_TAG, RemoteWidgetElement);
}

export default register;


