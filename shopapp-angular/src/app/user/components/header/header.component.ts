import { Component, Injectable, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/responses/user/user.response';
import { createPopper } from '@popperjs/core';
import { CartService } from '../../services/cart.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  public numberOfProducts: number = 0;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private cartService: CartService,
    private router: Router
  ) {}
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.numberOfProducts = this.cartService.getNumberOfProducts();
  }

  public refreshNumberOfProducts(): void {
    this.numberOfProducts = this.cartService.getNumberOfProducts();
  }

  public setNumberOfProducts(quantity: number): void {
    this.numberOfProducts = quantity;
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    //alert(`Clicked on "${index}"`);
    if (index === 0) {
      debugger;
      this.router.navigate(['/user-profile']);
    } else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
      this.router.navigate(['/login']);
    } else if (index === 3) {
      this.router.navigate(['/admin']);
    } else if (index == 4) {
      this.router.navigate(['/manager/raw-products-manager']);
    } else if (index === 1) {
      this.router.navigate(['/orders/manager']);
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item
  }

  setActiveNavItem(index: number) {
    this.activeNavItem = index;
    //alert(this.activeNavItem);
  }
}
