import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'remote',
    loadChildren: () => import('remote/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'remote-ce',
    loadComponent: async () => {
      const mod = await import('remote/Elements');
      const candidate = (mod as Record<string, unknown>)['register'];
      // mod as Record<string, unknown>)['register'] will work as well as mod as Record<string, unknown>)['default']
      // as it will return the function
      // default key is not needed as it will return the function
      if (typeof candidate === 'function') {
        await (candidate as () => Promise<void>)();
      }
      return (await import('./remote-ce.page')).RemoteCePage;
    },
  },
];
