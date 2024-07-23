import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'cards',
        pathMatch: 'full'
      },
      {
        path: 'cards', 
        loadComponent: () => import('./features/cards/components/cards-list/cards-list.component').then(m => m.CardsListComponent)
      }
    ]
  },
  { 
    path: '**',
    redirectTo: '' 
  },
];
