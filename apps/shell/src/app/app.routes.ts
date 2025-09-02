import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'remote',
    loadChildren: () => import('remote/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'remote-ce',
    loadComponent: () => import('./remote-ce.page').then((m) => m.RemoteCePage),
  },
];
