import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { LoginDTO } from '../dtos/login.dto';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Role } from '../models/role';
import { RoleService } from '../services/role.service';
import { LoginResponse } from '../responses/user/login.response';
import { UserResponse } from '../responses/user/user.response';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '';
  password: string = '';
  selectedRole: Role | undefined;
  roles: Role[] = [];
  rememberMe: boolean = false;
  userResponse?: UserResponse;
  showPassword: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private roleService: RoleService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    debugger;
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        debugger;
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: any) => {
        debugger;
        console.log(error.error.message);
      },
    });
  }

  login() {
    const message = `phone: ${this.phoneNumber}` + `password: ${this.password}`;
    //alert(message);
    debugger;

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1,
    };
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger;
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          debugger;
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              debugger;
              this.userResponse = {
                ...response.data,
                date_of_birth: new Date(response.data.date_of_birth),
              };
              this.userService.saveUserResponseToLocalStorage(
                this.userResponse
              );
              if (this.userResponse?.role.name == 'admin') {
                this.router.navigate(['/admin']);
              } else if (this.userResponse?.role.name == 'user') {
                this.router.navigate(['/']);
              }
            },
            complete: () => {
              this.cartService.refreshCartItems();
              debugger;
            },
            error: (error: any) => {
              debugger;
              alert(error.error.message);
            },
          });
        }
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(error.error.message);
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
  createAccount() {
    debugger;
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']);
  }
}
