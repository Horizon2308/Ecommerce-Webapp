import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store';
import { StoreDTO } from '../../dtos/store.dto';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from 'src/app/ultils/dialog-confirm/dialog-confirm.component';
import { UserService } from 'src/app/user/services/user.service';
import { environment } from 'src/app/user/environments/environment';

@Component({
  selector: 'app-store-manager',
  templateUrl: './store-manager.component.html',
  styleUrls: ['./store-manager.component.scss'],
})
export class StoreManagerComponent implements OnInit {
  stores: Store[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  sortOption: number = 1;
  index: number = 0;

  isAddModalOpen = false;
  isUpdateModelOpen = false;

  storeDTO: StoreDTO = {} as StoreDTO;

  updatedStoreDTO: StoreDTO = {} as StoreDTO;

  updatedStoreId: number = 0;

  userName: string =
    this.userService.getUserResponseFromLocalStorage()!.fullname;
  avatar = `${environment.apiBaseUrl}/users/avatar/${
    this.userService.getUserResponseFromLocalStorage()!.avatar
  }`;

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllStores(
      this.sortOption,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getAllStores(
    sortOption: number,
    keyword: string,
    page: number,
    limit: number
  ): void {
    this.storeService.getAllStores(sortOption, keyword, page, limit).subscribe({
      next: (response: any) => {
        debugger;
        this.stores = response.data.stores.content;
        this.totalPages = response.data.total_page;
        this.visiblePages = this.getVisiblePagesArray(
          this.currentPage,
          this.totalPages
        );
        this.index = 0;
      },
      complete: () => {},
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      },
    });
  }

  addStore(): void {
    this.storeService.createStore(this.storeDTO).subscribe({
      next: (response: any) => {
        let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
          width: '250px',
          data: {
            title: 'Thêm cửa hàng',
            message: 'Thêm cửa hàng thành công',
          },
        });
        dialogConfirm.afterClosed().subscribe((result) => {
          if (result) {
            this.isAddModalOpen = false;
            this.getAllStores(
              this.sortOption,
              this.keyword,
              this.currentPage,
              this.itemsPerPage
            );
          }
        });
      },
      complete: () => {},
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      },
    });
  }

  deleteStore(id: number): void {
    this.storeService.deleteStore(id).subscribe({
      next: (response: any) => {
        let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
          width: '250px',
          data: {
            title: 'Xóa cửa hàng',
            message: 'Xóa cửa hàng thành công',
          },
        });
        dialogConfirm.afterClosed().subscribe((result) => {
          if (result) {
            this.getAllStores(
              this.sortOption,
              this.keyword,
              this.currentPage,
              this.itemsPerPage
            );
          }
        });
      },
      complete: () => {},
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      },
    });
  }

  updateStore() {
    this.storeService
      .updateStore(this.updatedStoreId, this.updatedStoreDTO)
      .subscribe({
        next: (response: any) => {
          let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
            width: '250px',
            data: {
              title: 'Cập nhật cửa hàng',
              message: 'Cập nhật cửa hàng thành công',
            },
          });
          dialogConfirm.afterClosed().subscribe((result) => {
            if (result) {
              this.isUpdateModelOpen = false;
              this.getAllStores(
                this.sortOption,
                this.keyword,
                this.currentPage,
                this.itemsPerPage
              );
            }
          });
        },
        complete: () => {},
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        },
      });
  }

  onAddModalClose() {
    this.isAddModalOpen = false;
  }

  onAddModalOpen() {
    this.isAddModalOpen = true;
  }

  onUpdateModalClose() {
    this.isUpdateModelOpen = false;
  }

  onUpdateModalOpen(id: number) {
    this.isUpdateModelOpen = true;
    this.stores.forEach((item) => {
      if (item.id === id) {
        this.updatedStoreDTO = { ...item };
      }
    });
    this.updatedStoreId = id;
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.getAllStores(
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
    this.getAllStores(
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
