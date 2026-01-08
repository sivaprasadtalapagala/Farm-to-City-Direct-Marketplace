import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  {
  path: '',
  canActivate: [AuthGuard],
  loadComponent: () =>
    import('./features/products/pages/product-list/product-list.component')
      .then(m => m.ProductListComponent)
},

  {
    path: '**',
    redirectTo: ''
  }
];
