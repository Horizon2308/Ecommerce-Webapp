import { Component, ElementRef, Injectable, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { Product } from '../../models/product';
import { environment } from 'src/app/user/environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogBodyComponent } from 'src/app/ultils/dialog-body/dialog-body.component';
import { DialogConfirmComponent } from 'src/app/ultils/dialog-confirm/dialog-confirm.component';
import { Category } from 'src/app/user/models/category';
import { CategoryService } from '../../services/category.service';
import { ProductDTO } from '../../dtos/product.dto';
import { Location } from '@angular/common';
import { ProductUpdateDTO } from '../../dtos/product.update.dto';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-product-managerment',
  templateUrl: './product-managerment.component.html',
  styleUrls: ['./product-managerment.component.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class ProductManagermentComponent implements OnInit {
  products: Product[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  updatedProduct: ProductUpdateDTO = {} as ProductUpdateDTO;
  categories: Category[] = [];
  user: string = '';
  avatar = `${environment.apiBaseUrl}/users/avatar/${
    this.userService.getUserResponseFromLocalStorage()!.avatar
  }`;

  @ViewChild('closeUpdate', { static: false }) closeUpdate:
    | ElementRef
    | undefined;

  // @ViewChild('closeCategory', { static: false }) closeCategory:
  //   | ElementRef
  //   | undefined;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private userService: UserService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    this.user = this.userService.getUserResponseFromLocalStorage()!.fullname;
    this.getAllProducts(this.keyword, this.currentPage, this.itemsPerPage);
    this.categoryService.getAllCategories(0, 100).subscribe({
      next: (response: any) => {
        debugger;
        this.categories = response.data.categories.content;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(error.error);
        console.error('Error fetching products:', error);
      },
    });
  }

  openDialog(): void {}

  getAllProducts(keyword: string, page: number, limit: number): void {
    this.productService.getAllProducts(keyword, page, limit).subscribe({
      next: (response: any) => {
        debugger;
        response.data.products.content.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        this.products = response.data.products.content;
        this.totalPages = response.data.total_page;
        this.visiblePages = this.getVisiblePagesArray(
          this.currentPage,
          this.totalPages
        );
      },
      complete: () => {},
      error: (error: any) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.getAllProducts(this.keyword, this.currentPage, this.itemsPerPage);
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    debugger;
    this.getAllProducts(this.keyword, this.currentPage, this.itemsPerPage);
  }
  getVisiblePagesArray(page: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisblePage = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(page - halfVisblePage, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  deleteProduct(productId: number): void {
    const dialogRef = this.dialog.open(DialogBodyComponent, {
      width: '250px',
      data: { title: 'Xóa sản phẩm', message: 'Bạn có chắc muốn xóa không ?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.deleteProduct(productId).subscribe({
          next: (response: any) => {
            const dialogConfirm = this.dialog.open(DialogConfirmComponent, {
              width: '250px',
              data: {
                title: 'Xóa sản phẩm',
                message: 'Xóa thành công',
              },
            });
            dialogConfirm.afterClosed().subscribe((result) => {
              if (result) {
                this.getAllProducts(
                  this.keyword,
                  this.currentPage,
                  this.itemsPerPage
                );
              }
            });
          },
          complete: () => {
            debugger;
          },
          error: (error: any) => {
            debugger;
            alert(error.error);
            console.error('Error fetching products:', error);
          },
        });
      }
    });
  }
  getUpdatedProduct(productId: number): void {
    this.productService.getProduct(productId).subscribe({
      next: (response: any) => {
        debugger;
        this.updatedProduct = response.data;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(error.error);
        console.error('Error fetching products:', error);
      },
    });
  }

  updateProduct(): void {
    debugger;
    let productUpdateDTO: ProductDTO = {
      name: this.updatedProduct!.name,
      price: this.updatedProduct!.price,
      thumbnail: this.updatedProduct!.thumbnail,
      quantity: this.updatedProduct!.quantity,
      description: this.updatedProduct!.description,
      product_status: this.updatedProduct!.product_status,
      category_id: this.updatedProduct!.category_id,
    };
    debugger;
    this.productService
      .updateProduct(this.updatedProduct!.id, productUpdateDTO)
      .subscribe({
        next: (response: any) => {
          let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
            width: '250px',
            data: {
              title: 'Cập nhật sản phẩm',
              message: 'Cập nhật thành công',
            },
          });
          dialogConfirm.afterClosed().subscribe((result) => {
            if (result) {
              this.getAllProducts(
                this.keyword,
                this.currentPage,
                this.itemsPerPage
              );
              this.renderer
                .selectRootElement(this.closeUpdate!.nativeElement)
                .click();
            }
          });
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
            width: '250px',
            data: {
              title: 'Cập nhật sản phẩm',
              message: 'Cập nhật thất bại',
            },
          });
          dialogConfirm.afterClosed().subscribe((result) => {
            if (result) {
              this.renderer
                .selectRootElement(this.closeUpdate!.nativeElement)
                .click();
            }
          });
        },
      });
  }
}
