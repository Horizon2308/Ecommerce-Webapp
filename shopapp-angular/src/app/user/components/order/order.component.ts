import { Component, Injectable, OnInit } from '@angular/core';
import {
  EmailValidator,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { TokenService } from '../../services/token.service';
import { OrderDTO } from '../../dtos/order.dto';
import { environment } from '../../environments/environment';
import { OrderService } from '../../services/order.service';
import { GHNService } from '../../services/ghn.service';
import { Province } from '../../../responses/ghn/province.interface';
import { District } from '../../../responses/ghn/district.interface';
import { Ward } from '../../../responses/ghn/ward.interface';
import { Service } from '../../../responses/ghn/service.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogBodyComponent } from 'src/app/ultils/dialog-body/dialog-body.component';
import { DialogConfirmComponent } from 'src/app/ultils/dialog-confirm/dialog-confirm.component';
import { PaymentService } from '../../services/payment.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { product: Product; quantity: number }[] = [];
  couponCode: string = ''; // Mã giảm giá
  totalAmount: number = 0; // Tổng tiền
  cart: Map<number, number> = new Map();
  orderData: OrderDTO = {
    user_id: 0, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod', // Mặc định là thanh toán khi nhận hàng (COD)
    shipping_method: 'express', // Mặc định là vận chuyển nhanh (Express)
    shipping_address: '',
    cart_items: [],
  };

  provinces: Province[] = [];
  selectedProvinceId: number = 0;
  districts: District[] = [];
  selectedDistrictId: number = 0;
  wards: Ward[] = [];
  selectedWardCode: string = '';
  services: Service[] = [];
  selectedServiceId: number = 0;
  shippingPrice: number = 0;
  shippingDate: Date = new Date();

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private ghnService: GHNService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', Validators.email],
      phone_number: ['', [Validators.maxLength(10), Validators.minLength(9)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
      //shipping_address: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      shipping_method: [''],
      payment_method: ['cod'],
      province: [0],
      district: [0],
      ward: [0],
      service: [0],
    });
  }

  ngOnInit(): void {
    debugger;
    this.orderData.user_id = this.tokenService.getUserId();
    this.cart = this.cartService.getCartItems();
    const productIds = Array.from(this.cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    // debugger;
    // if (productIds.length === 0) {
    //   return;
    // }

    debugger;
    this.ghnService.getProvince().subscribe({
      next: (response: any) => {

        this.provinces = response.data.map((province: any) => {
          return {
            provinceId: province.ProvinceID,
            provinceName: province.ProvinceName,
          };
        });
        console.log('Get provinces successfully!');
      },
      complete: () => {

        console.log('Completed!');
      },
      error: (error: any) => {

        console.error('Error fetching provinces:', error);
      },
    });

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        debugger;
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          debugger;
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: this.cart.get(productId)!,
          };
        });
        console.log('Get product by ids');
      },
      complete: () => {
        debugger;
        this.calculateTotal();
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      },
    });
  }

  provinceChange(): void {
    debugger;
    this.selectedProvinceId = Number.parseInt(
      this.orderForm.get('province')!.value
    );
    this.ghnService.getDistrict(this.selectedProvinceId).subscribe({
      next: (response: any) => {
        this.districts = response.data.map((district: any) => {
          return {
            districtId: district.DistrictID,
            districtName: district.DistrictName,
          };
        });
      },
      complete: () => {
        debugger;
        console.log('Completed!');
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching districts:', error);
      },
    });
  }

  districtChange(): void {
    this.selectedDistrictId = Number.parseInt(
      this.orderForm.get('district')!.value
    );
    this.ghnService.getWard(this.selectedDistrictId).subscribe({
      next: (response: any) => {
        this.wards = response.data.map((ward: any) => {
          return {
            wardCode: ward.WardCode,
            wardName: ward.WardName,
          };
        });
      },
      complete: () => {
        debugger;
        console.log('Completed!');
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching wards:', error);
      },
    });
  }

  wardChange(): void {
    this.selectedWardCode = this.orderForm.get('ward')!.value;
    this.ghnService.getMethodServices(this.selectedDistrictId).subscribe({
      next: (response: any) => {
        this.services = response.data.map((service: any) => {
          return {
            serviceId: service.service_id,
            serviceName: service.short_name,
          };
        });
      },
      complete: () => {
        debugger;
        console.log('Completed!');
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching services:', error);
      },
    });
  }

  serviceChange(): void {
    debugger;
    this.selectedServiceId = Number.parseInt(
      this.orderForm.get('service')!.value
    );
    this.ghnService
      .getFee(
        this.selectedServiceId,
        this.totalAmount,
        this.selectedWardCode,
        this.selectedDistrictId
      )
      .subscribe({
        next: (response: any) => {
          debugger;
          this.shippingPrice = response.data.total;
          console.log('Get shipping price!');
        },
        complete: () => {
          debugger;
          this.totalAmount += this.shippingPrice;
          console.log('Completed!');
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching fee:', error);
        },
      });
  }

  generateShippingDate(): void {
    this.ghnService
      .getShippingDate(
        this.selectedDistrictId,
        this.selectedWardCode,
        this.selectedServiceId
      )
      .subscribe({
        next: (response: any) => {
          this.shippingDate = new Date(Date.now() + response.data.leadtime);
          console.log('Get shipping date successfully!');
        },
        complete: () => {
          debugger;
          this.totalAmount += this.shippingPrice;
          console.log('Completed!');
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching shipping date:', error);
        },
      });
  }

  placeOrder() {
    debugger;
    if (this.orderForm.errors == null) {
      // sử dụng spread để copy giá trị từ orderForm sang orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
      };
      let provinceName, districtName, wardName;
      this.provinces.forEach((province) => {
        if (province.provinceId == this.selectedProvinceId) {
          provinceName = province.provinceName;
        }
      });
      this.districts.forEach((district) => {
        if (district.districtId == this.selectedDistrictId) {
          districtName = district.districtName;
        }
      });
      this.wards.forEach((ward) => {
        if (ward.wardCode == this.selectedWardCode) {
          wardName = ward.wardName;
        }
      });
      const address = `${wardName}, ${districtName}, ${provinceName}`;
      this.orderData.address = address;
      this.orderData.shipping_address = address;
      this.orderData.total_money = this.totalAmount;
      this.services.forEach((service) => {
        if (service.serviceId == this.selectedServiceId) {
          this.orderData.shipping_method = service.serviceName;
        }
      });
      this.orderData.cart_items = this.cartItems.map((cartItem) => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      }));
      this.orderData.total_money = this.totalAmount;
      debugger;
      // Dữ liệu hợp lệ
      if (this.orderData.payment_method === 'onl') {
        debugger
        this.paymentService.vnPay(this.orderData.total_money).subscribe({
          next: (response: any) => {
            debugger;
            let nextUrl = response.data.paymentUrl;
            window.location.href = nextUrl;

            this.orderService.placeOrder(this.orderData).subscribe({
              next: (response: any) => {
                debugger;
                const dialogConfirm = this.dialog.open(DialogConfirmComponent, {
                  width: '250px',
                  data: {
                    title: 'Đặt hàng',
                    message: 'Đặt hàng thành công',
                  },
                });
                dialogConfirm.afterClosed().subscribe((result) => {
                  if (result) {
                    this.cartService.clearCartItems();
                    let orderId = response.data.id;
                    //this.router.navigate(['/orders/'], orderId);
                    location.reload();
                  }
                });
              },
              complete: () => {
                debugger;
                this.calculateTotal();
              },
              error: (error: any) => {
                debugger;
                alert(`Lỗi khi đặt hàng: ${error}`);
              },
            });
          },
          complete: () => {
            debugger;
          },
          error: (error: any) => {
            console.error('Error fetching categories:', error);
          },
        });
      } else {
        this.orderService.placeOrder(this.orderData).subscribe({
          next: (response: any) => {
            debugger;
            const dialogConfirm = this.dialog.open(DialogConfirmComponent, {
              width: '250px',
              data: {
                title: 'Đặt hàng',
                message: 'Đặt hàng thành công',
              },
            });
            dialogConfirm.afterClosed().subscribe((result) => {
              if (result) {
                this.cartService.clearCartItems();
                let orderId = response.data.id;
                //this.router.navigate(['/orders/'], orderId);
                location.reload();
              }
            });
          },
          complete: () => {
            debugger;
            this.calculateTotal();
          },
          error: (error: any) => {
            debugger;
            alert(`Lỗi khi đặt hàng: ${error}`);
          },
        });
      }
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  increaseQuantity(index: number): void {
    if (
      this.cartItems[index].quantity < this.cartItems[index].product.quantity
    ) {
      this.cartItems[index].quantity++;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  confirmDelete(index: number): void {
    const dialogRef = this.dialog.open(DialogBodyComponent, {
      width: '250px',
      data: { title: 'Xóa sản phẩm', message: 'Bạn có chắc muốn xóa không ?' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Xóa sản phẩm khỏi danh sách cartItems
        this.cartItems.splice(index, 1);
        // Cập nhật lại this.cart từ this.cartItems
        this.updateCartFromCartItems();
        // Tính toán lại tổng tiền
        this.calculateTotal();
        const dialogConfirm = this.dialog.open(DialogConfirmComponent, {
          width: '250px',
          data: {
            title: 'Xóa sản phẩm',
            message: 'Xóa thành công',
          },
        });
        dialogConfirm.afterClosed().subscribe((result) => {
          if (result) {
            //location.reload();
            dialogConfirm.close();
          }
        });
      }
    });
    // if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    //   // Xóa sản phẩm khỏi danh sách cartItems
    //   this.cartItems.splice(index, 1);
    //   // Cập nhật lại this.cart từ this.cartItems
    //   this.updateCartFromCartItems();
    //   // Tính toán lại tổng tiền
    //   this.calculateTotal();
    // }
  }
  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {}

  public updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCartItems(this.cart);
  }
}
