import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderDetail } from '../../models/order.detail';
import { environment } from '../../environments/environment';
import { Order } from '../../models/order';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss'],
})
export class OrderConfirmComponent implements OnInit {
  orders: Order[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  userId = this.userService.getUserResponseFromLocalStorage()!.id;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    debugger;
    this.orderService.getAllOrdersByUserId(this.userId, 0, 10).subscribe({
      next: (response: any) => {
        debugger;
        this.orders = response.data.orders_list.content;
        this.orders.forEach((order) => {
          order.order_details.forEach((orderDetail) => {
            orderDetail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${orderDetail.product.thumbnail}`;
          });
        });
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      },
    });
  }
}
