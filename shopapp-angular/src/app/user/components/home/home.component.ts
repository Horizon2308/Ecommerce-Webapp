import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { environment } from '../../environments/environment';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  keyword: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts(
      this.selectedCategoryId,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
    this.getCategories(0, 100);
  }

  getProducts(
    categoryId: number,
    keyword: string,
    page: number,
    limit: number
  ) {
    this.productService
      .getAllProducts(categoryId, keyword, page, limit)
      .subscribe({
        next: (response: any) => {
          debugger;
          response.data.forEach((product: Product) => {
            product.url = `${environment.apiNest}/products/images/${product.thumbnail}`;
          });
          this.products = response.data;
          this.totalPages = response.total_page;
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

  onCategoryId(id: number) {
    this.selectedCategoryId = id;
    this.searchProducts();
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.getProducts(
      this.selectedCategoryId,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    debugger;
    this.getProducts(
      this.selectedCategoryId,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getAllCategories(page, limit).subscribe({
      next: (response: any) => {
        debugger;
        this.categories = response.data;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      },
    });
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

  onProductClick(productId: number) {
    debugger;
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/products', productId]);
  }
}
