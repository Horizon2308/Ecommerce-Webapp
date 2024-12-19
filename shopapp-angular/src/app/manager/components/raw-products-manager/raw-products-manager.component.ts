import { Component, OnInit } from '@angular/core';
import { RawProductService } from '../../services/raw.product.service';
import { RawProduct } from '../../models/raw.product';
import { environment } from 'src/app/user/environments/environment';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-raw-products-manager',
  templateUrl: './raw-products-manager.component.html',
  styleUrls: ['./raw-products-manager.component.scss'],
})
export class RawProductsManagerComponent implements OnInit {
  rawProducts: RawProduct[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  sortOption: number = 1;
  index: number = 0;

  userName: string =
    this.userService.getUserResponseFromLocalStorage()!.fullname;
  avatar = `${environment.apiBaseUrl}/users/avatar/${
    this.userService.getUserResponseFromLocalStorage()!.avatar
  }`;

  constructor(
    private rawProductService: RawProductService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.getAllRawProducts(
      this.sortOption,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getAllRawProducts(
    sortOption: number,
    keyword: string,
    page: number,
    limit: number
  ): void {
    const datePipe = new DatePipe('en-US');
    this.rawProductService
      .getAllRawProducts(sortOption, keyword, page, limit)
      .subscribe({
        next: (response: any) => {
          debugger;
          this.rawProducts = response.data.raw_products.content;
          this.totalPages = response.data.total_page;
          this.visiblePages = this.getVisiblePagesArray(
            this.currentPage,
            this.totalPages
          );
          this.index = 0;
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
    this.getAllRawProducts(
      this.sortOption,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    debugger;
    this.getAllRawProducts(
      this.sortOption,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
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
}
