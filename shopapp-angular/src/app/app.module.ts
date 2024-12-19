import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './user/components/home/home.component';
import { FooterComponent } from './user/components/footer/footer.component';
import { DetailProductComponent } from './user/components/detail-product/detail-product.component';
import { OrderComponent } from './user/components/order/order.component';
import { OrderConfirmComponent } from './user/components/order-confirm/order-confirm.component';
import { LoginComponent } from './user/components/login/login.component';
import { RegisterComponent } from './user/components/register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './user/components/user-profile/user-profile.component';
import { HeaderComponent } from './user/components/header/header.component';
import { HomeAdminComponent } from './admin/components/home-admin/home-admin.component';
import { ProductManagermentComponent } from './admin/components/product-managerment/product-managerment.component';
import { HeaderAdminComponent } from './admin/components/header-admin/header-admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogBodyComponent } from './ultils/dialog-body/dialog-body.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogConfirmComponent } from './ultils/dialog-confirm/dialog-confirm.component';
import { AddProductComponent } from './admin/components/add-product/add-product.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
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
import { ModalComponent } from './ultils/modal/modal.component';
import { StoreManagerComponent } from './manager/components/store-manager/store-manager.component';
import { ExportTransactionDocumentComponent } from './manager/components/export/export-transaction-document/export-transaction-document.component';
import { AddExportTransactionDocumentComponent } from './manager/components/export/add-export-transaction-document/add-export-transaction-document.component';
import { ExportTransactionDocumentDetailsComponent } from './manager/components/export/export-transaction-document-details/export-transaction-document-details.component';
import { DdMmYYYYDatePipe } from './dd-mm-yyyy-date.pipe';
import { UsernameAvatarComponent } from './ultils/username-avatar/username-avatar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DetailProductComponent,
    OrderComponent,
    OrderConfirmComponent,
    LoginComponent,
    RegisterComponent,
    AppComponent,
    UserProfileComponent,
    HomeAdminComponent,
    ProductManagermentComponent,
    HeaderAdminComponent,
    DialogBodyComponent,
    DialogConfirmComponent,
    AddProductComponent,
    StaffManagermentComponent,
    AddUserComponent,
    OrderManagermentComponent,
    EditOrderComponent,
    BlogComponent,
    IncomeManagermentComponent,
    RawProductsManagerComponent,
    TransactionDocumentManagerComponent,
    TransactionDocumentDetailComponent,
    AddTransactionDocumentComponent,
    ProviderManagerComponent,
    ModalComponent,
    StoreManagerComponent,
    ExportTransactionDocumentComponent,
    AddExportTransactionDocumentComponent,
    ExportTransactionDocumentDetailsComponent,
    DdMmYYYYDatePipe,
    UsernameAvatarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CKEditorModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [
    // HomeComponent,
    AppComponent,
    // HomeAdminComponent,
    // DetailProductComponent,
    // OrderComponent,
    // OrderConfirmComponent,
    // LoginComponent,
    // RegisterComponent,
  ],
})
export class AppModule {}
