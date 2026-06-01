import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', loadComponent: () => import('./pages/auth.pages').then(m => m.SplashPage) },
  { path: 'onboarding', loadComponent: () => import('./pages/auth.pages').then(m => m.OnboardingPage) },
  { path: 'login', loadComponent: () => import('./pages/auth.pages').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/auth.pages').then(m => m.RegisterPage) },
  { path: 'product-detail/:id', loadComponent: () => import('./pages/shop.pages').then(m => m.ProductDetailPage) },
  { path: 'wishlist', loadComponent: () => import('./pages/shop.pages').then(m => m.WishlistPage) },
  { path: 'cart', loadComponent: () => import('./pages/shop.pages').then(m => m.CartPage) },
  { path: 'checkout', loadComponent: () => import('./pages/shop.pages').then(m => m.CheckoutPage) },
  { path: 'order-tracking', loadComponent: () => import('./pages/user.pages').then(m => m.OrderTrackingPage) },
  { path: 'chat', loadComponent: () => import('./pages/user.pages').then(m => m.ChatPage) },
  { path: 'review-rating', loadComponent: () => import('./pages/user.pages').then(m => m.ReviewRatingPage) },
  { path: 'edit-profile', loadComponent: () => import('./pages/user.pages').then(m => m.EditProfilePage) },
  { path: 'address-list', loadComponent: () => import('./pages/user.pages').then(m => m.AddressListPage) },
  { path: 'address-form', loadComponent: () => import('./pages/user.pages').then(m => m.AddressFormPage) },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'home', loadComponent: () => import('./pages/shop.pages').then(m => m.HomePage) },
      { path: 'history', loadComponent: () => import('./pages/orders.pages').then(m => m.OrdersPage) },
      { path: 'cart', loadComponent: () => import('./pages/shop.pages').then(m => m.CartPage) },
      { path: 'chat-list', loadComponent: () => import('./pages/user.pages').then(m => m.ChatListPage) },
      { path: 'profile', loadComponent: () => import('./pages/user.pages').then(m => m.ProfilePage) },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
