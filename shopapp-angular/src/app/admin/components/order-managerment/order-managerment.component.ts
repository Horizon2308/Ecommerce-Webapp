import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBodyComponent } from 'src/app/ultils/dialog-body/dialog-body.component';
import { DialogConfirmComponent } from 'src/app/ultils/dialog-confirm/dialog-confirm.component';
import { Order } from 'src/app/user/models/order';
import { OrderDetail } from 'src/app/user/models/order.detail';
import { OrderService } from 'src/app/user/services/order.service';
import { UserService } from 'src/app/user/services/user.service';
import { Router } from '@angular/router';
import { environment } from 'src/app/user/environments/environment';

@Component({
  selector: 'app-order-managerment',
  templateUrl: './order-managerment.component.html',
  styleUrls: ['./order-managerment.component.scss'],
})
export class OrderManagermentComponent implements OnInit {
  user: string = '';
  orders: Order[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  listOfProductName: string = '';
  avatar = `${environment.apiBaseUrl}/users/avatar/${
    this.userService.getUserResponseFromLocalStorage()!.avatar
  }`;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.user = this.userService.getUserResponseFromLocalStorage()!.fullname;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getAllOrders(keyword: string, page: number, limit: number): void {
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (response: any) => {
        debugger;
        this.orders = response.data.orders_list.content;
        this.totalPages = response.data.total_page;
        this.visiblePages = this.getVisiblePagesArray(
          this.currentPage,
          this.totalPages
        );
        this.getListOfProductName();
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
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    debugger;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
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

  getListOfProductName(): void {
    debugger;
    this.orders.forEach((order: Order) => {
      order.listOfProductName = '';
      order.order_details.forEach((orderDetails: OrderDetail) => {
        debugger;
        order.listOfProductName += orderDetails.product.name;
        order.listOfProductName += ', ';
      });
      order.listOfProductName = order.listOfProductName.substring(
        0,
        order.listOfProductName.length - 2
      );
    });
  }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(DialogBodyComponent, {
      width: '250px',
      data: { title: 'Xóa sản phẩm', message: 'Bạn có chắc muốn xóa không ?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.orderService.deleteOrder(id).subscribe({
          next: (response: any) => {
            const dialogConfirm = this.dialog.open(DialogConfirmComponent, {
              width: '250px',
              data: {
                title: 'Xóa đơn hàng',
                message: 'Xóa thành công',
              },
            });
            dialogConfirm.afterClosed().subscribe((result) => {
              if (result) {
                this.getAllOrders(
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

  editButtonClick(id: number): void {
    this.router.navigate(['/admin/orders-manager', id]);
  }
}
