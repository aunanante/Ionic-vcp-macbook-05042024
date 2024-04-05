import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'villes-commerces',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'business-owner-modal',
    loadChildren: () => import('./pages/business-owner-modal/business-owner-modal.module').then( m => m.BusinessOwnerModalPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'category-products/:id',
    loadChildren: () => import('./pages/category-products/category-products.module').then( m => m.CategoryProductsPageModule)
  },
  {
    path: 'commerce-categories',
    loadChildren: () => import('./pages/commerce-categories/commerce-categories.module').then( m => m.CommerceCategoriesPageModule)
  },
  {
    path: 'commerce-modal',
    loadChildren: () => import('./pages/commerce-modal/commerce-modal.module').then( m => m.CommerceModalPageModule)
  },
  {
    path: 'commerces',
    loadChildren: () => import('./pages/commerces/commerces.module').then( m => m.CommercesPageModule)
  },
  {
    path: 'create-category-modal/:id', 
    loadChildren: () => import('./pages/create-category-modal/create-category-modal.module').then( m => m.CreateCategoryModalPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'delete-business-owner-modal',
    loadChildren: () => import('./pages/delete-business-owner-modal/delete-business-owner-modal.module').then( m => m.DeleteBusinessOwnerModalPageModule)
  },
  {
    path: 'delete-category-modal',
    loadChildren: () => import('./pages/delete-category-modal/delete-category-modal.module').then( m => m.DeleteCategoryModalPageModule)
  },
  {
    path: 'delete-commerce-modal',
    loadChildren: () => import('./pages/delete-commerce-modal/delete-commerce-modal.module').then( m => m.DeleteCommerceModalPageModule)
  },
  {
    path: 'delete-detail-modal',
    loadChildren: () => import('./pages/delete-detail-modal/delete-detail-modal.module').then( m => m.DeleteDetailModalPageModule)
  },
  {
    path: 'delete-product-modal',
    loadChildren: () => import('./pages/delete-product-modal/delete-product-modal.module').then( m => m.DeleteProductModalPageModule)
  },
  {
    path: 'detail-add-modal',
    loadChildren: () => import('./pages/detail-add-modal/detail-add-modal.module').then( m => m.DetailAddModalPageModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'enter-custom-renewal-values-modal',
    loadChildren: () => import('./pages/enter-custom-renewal-values-modal/enter-custom-renewal-values-modal.module').then( m => m.EnterCustomRenewalValuesModalPageModule)
  },
  {
    path: 'enter-custom-values-modal',
    loadChildren: () => import('./pages/enter-custom-values-modal/enter-custom-values-modal.module').then( m => m.EnterCustomValuesModalPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'payments',
    loadChildren: () => import('./pages/payments/payments.module').then( m => m.PaymentsPageModule)
  },
  {
    path: 'product-details/:id',
    loadChildren: () => import('./pages/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'product-modal-add',
    loadChildren: () => import('./pages/product-modal-add/product-modal-add.module').then( m => m.ProductModalAddPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'update-business-owner-modal',
    loadChildren: () => import('./pages/update-business-owner-modal/update-business-owner-modal.module').then( m => m.UpdateBusinessOwnerModalPageModule)
  },
  {
    path: 'update-category-modal',
    loadChildren: () => import('./pages/update-category-modal/update-category-modal.module').then( m => m.UpdateCategoryModalPageModule)
  },
  {
    path: 'update-commerce-modal',
    loadChildren: () => import('./pages/update-commerce-modal/update-commerce-modal.module').then( m => m.UpdateCommerceModalPageModule)
  },
  {
    path: 'update-detail-modal',
    loadChildren: () => import('./pages/update-detail-modal/update-detail-modal.module').then( m => m.UpdateDetailModalPageModule)
  },
  {
    path: 'update-product-modal',
    loadChildren: () => import('./pages/update-product-modal/update-product-modal.module').then( m => m.UpdateProductModalPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'villes-commerces',
    loadChildren: () => import('./pages/villes-commerces/villes-commerces.module').then( m => m.VillesCommercesPageModule)
  },
  {
    path: 'villes-modal',
    loadChildren: () => import('./pages/villes-modal/villes-modal.module').then( m => m.VillesModalPageModule)
  },
  {
    path: 'create-payment',
    loadChildren: () => import('./pages/create-payment/create-payment.module').then( m => m.CreatePaymentPageModule)
  },
  {
    path: 'renew-payment',
    loadChildren: () => import('./pages/renew-payment/renew-payment.module').then( m => m.RenewPaymentPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
