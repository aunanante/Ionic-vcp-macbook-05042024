import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'user',
        loadChildren: () => import('../user/user.module').then(m => m.UserPageModule)
      },
      {
        path: 'commerces',
        loadChildren: () => import('../commerces/commerces.module').then(m => m.CommercesPageModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../products/products.module').then(m => m.ProductsPageModule)
      },
      {
        path: 'details',
        loadChildren: () => import('../details/details.module').then(m => m.DetailsPageModule)
      },
      {
        path: '', // Empty path for the default route (user)
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'payments',
        loadChildren: () => import('../payments/payments.module').then(m => m.PaymentsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
