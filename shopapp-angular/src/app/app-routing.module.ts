import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './user/components/order/order.component';
import { DetailProductComponent } from './user/components/detail-product/detail-product.component';
import { RegisterComponent } from './user/components/register/register.component';
import { LoginComponent } from './user/components/login/login.component';
import { HomeComponent } from './user/components/home/home.component';
import { OrderConfirmComponent } from './user/components/order-confirm/order-confirm.component';
import { UserProfileComponent } from './user/components/user-profile/user-profile.component';
import { AuthGuardFn } from './guards/auth.guard';
import { HomeAdminComponent } from './admin/components/home-admin/home-admin.component';
import { AdminGuardFn } from './guards/admin.guard';
import { ProductManagermentComponent } from './admin/components/product-managerment/product-managerment.component';
import { AddProductComponent } from './admin/components/add-product/add-product.component';
import { StaffManagermentComponent } from './admin/components/staff-managerment/staff-managerment.component';
import { AddUserComponent } from './admin/components/add-user/add-user.component';
import { OrderManagermentComponent } from './admin/components/order-managerment/order-managerment.component';
import { EditOrderComponent } from './admin/components/edit-order/edit-order.component';
import { BlogComponent } from './user/components/blog/blog.component';
import { IncomeManagermentComponent } from './admin/components/income-managerment/income-managerment.component';
import { RawProductsManagerComponent } from './manager/components/raw-products-manager/raw-products-manager.component';
import { TransactionDocumentManagerComponent } from './manager/components/import-transaction-document/transaction-document-manager/transaction-document-manager.component';
import { TransactionDocumentDetailComponent } from './manager/components/import-transaction-document/transaction-document-detail/transaction-document-detail.component';
import { AddTransactionDocumentComponent } from './manager/components/import-transaction-document/add-transaction-document/add-transaction-document.component';
import { ProviderManagerComponent } from './manager/components/provider-manager/provider-manager.component';
import { StoreManagerComponent } from './manager/components/store-manager/store-manager.component';
import { ExportTransactionDocumentComponent } from './manager/components/export/export-transaction-document/export-transaction-document.component';
import { AddExportTransactionDocumentComponent } from './manager/components/export/add-export-transaction-document/add-export-transaction-document.component';
import { ExportTransactionDocumentDetailsComponent } from './manager/components/export/export-transaction-document-details/export-transaction-document-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'blog', component: BlogComponent },
  {
    path: 'products/:id',
    component: DetailProductComponent,
    canActivate: [AuthGuardFn],
  },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuardFn],
  },
  { path: 'orders/manager', component: OrderConfirmComponent },
  //  Admin
  {
    path: 'admin',
    component: HomeAdminComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'admin/products',
    component: ProductManagermentComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'admin/products/add',
    component: AddProductComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'admin/staffs',
    component: StaffManagermentComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'admin/staffs/add',
    component: AddUserComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'admin/orders-manager',
    component: OrderManagermentComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'admin/orders-manager/:id',
    component: EditOrderComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'admin/income',
    component: IncomeManagermentComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'manager/raw-products-manager',
    component: RawProductsManagerComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'manager/transaction-document-manager',
    component: TransactionDocumentManagerComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'manager/transaction-document-details/:id',
    component: TransactionDocumentDetailComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'manager/transaction-document/import',
    component: AddTransactionDocumentComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'manager/provider-manager',
    component: ProviderManagerComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'manager/store-manager',
    component: StoreManagerComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'manager/export-transaction-document',
    component: ExportTransactionDocumentComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'manager/add-export-transaction-document',
    component: AddExportTransactionDocumentComponent,
    canActivate: [AdminGuardFn],
  },
  {
    path: 'manager/export-transaction-document-details/:id',
    component: ExportTransactionDocumentDetailsComponent,
    canActivate: [AdminGuardFn],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
