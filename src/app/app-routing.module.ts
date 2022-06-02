import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './admin/login/login.component';
import { SuccessOrderComponent } from './success-order/success-order.component';
import { CartComponent } from './cart/cart.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: MainPageComponent }, // Mặc định sẽ route vào trang chủ
    { path: 'mainpage', component: MainPageComponent },
    { path: 'cart', component: CartComponent },
    { path: 'product/:gender', component: ProductListComponent },
    { path: 'product-detail/:id', component: ProductDetailComponent, },
    { path: 'blog', component: BlogListComponent },
    { path: 'blog-detail', component: BlogDetailComponent },
    { path: "success-order", component: SuccessOrderComponent },
    { path: "pagenotfound", component: PageNotFoundComponent },
    { path: "admin", component: LoginComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
