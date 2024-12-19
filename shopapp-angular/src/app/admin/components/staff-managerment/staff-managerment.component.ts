import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { Staff } from '../../models/staff';
import { environment } from 'src/app/user/environments/environment';
import { DatePipe } from '@angular/common';
import { DialogBodyComponent } from 'src/app/ultils/dialog-body/dialog-body.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from 'src/app/ultils/dialog-confirm/dialog-confirm.component';
import { UserDTO } from '../../dtos/user.dto';
import { Role } from 'src/app/user/models/role';
import { RoleService } from 'src/app/user/services/role.service';

@Component({
  selector: 'app-staff-managerment',
  templateUrl: './staff-managerment.component.html',
  styleUrls: ['./staff-managerment.component.scss'],
})
export class StaffManagermentComponent implements OnInit {
  userName: string = '';
  keyword: string = '';
  staffs: Staff[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  updatedStaff: UserDTO = {} as UserDTO;
  roles: Role[] = [];
  avatar = `${environment.apiBaseUrl}/users/avatar/${
    this.userService.getUserResponseFromLocalStorage()!.avatar
  }`;

  @ViewChild('closeUpdate', { static: false }) closeUpdate:
    | ElementRef
    | undefined;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    this.userName =
      this.userService.getUserResponseFromLocalStorage()!.fullname;
    this.getAllStaffs(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getAllStaffs(keyword: string, page: number, limit: number): void {
    const datePipe = new DatePipe('en-US');
    this.userService.getAllStaffs(keyword, page, limit).subscribe({
      next: (response: any) => {
        debugger;
        response.data.users.content.forEach((staff: Staff) => {
          if (staff.avatar != null) {
            debugger;
            staff.avatar = `${environment.apiBaseUrl}/users/avatar/${staff.avatar}`;
          }
        });
        this.staffs = response.data.users.content;
        for (let i = 0; i < this.staffs.length; i++) {
          const date = new Date(this.staffs[i].date_of_birth);
          let dateOfBirth = datePipe.transform(date, 'dd/MM/yyyy');
          if (dateOfBirth != null) {
            this.staffs[i].date_of_birth = dateOfBirth;
          }
        }
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
    this.getAllStaffs(this.keyword, this.currentPage, this.itemsPerPage);
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

  searchStaff() {
    this.getAllStaffs(this.keyword, this.currentPage, this.itemsPerPage);
  }

  deleteStaff(staffId: number) {
    const dialogRef = this.dialog.open(DialogBodyComponent, {
      width: '250px',
      data: { title: 'Xóa nhân viên', message: 'Bạn có chắc muốn xóa không ?' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(staffId).subscribe({
          next: (response: any) => {
            const dialogConfirm = this.dialog.open(DialogConfirmComponent, {
              width: '250px',
              data: {
                title: 'Xóa nhân viên',
                message: 'Xóa thành công',
              },
            });
            dialogConfirm.afterClosed().subscribe((result) => {
              if (result) {
                this.getAllStaffs(
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
            console.error('Error fetching staffs:', error);
          },
        });
      }
    });
  }

  getUpdatedStaff(staffId: number): void {
    debugger;
    this.userService.getUser(staffId).subscribe({
      next: (response: any) => {
        debugger;
        this.updatedStaff = response.data;
        this.updatedStaff.role_id = response.data.role.id;
        this.roleService.getRoles().subscribe({
          next: (response: any) => {
            this.roles = response;
          },
          complete: () => {},
          error: (error: any) => {
            debugger;
            console.log(error.error);
          },
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

  updateUser() {
    const dialogRef = this.dialog.open(DialogBodyComponent, {
      width: '250px',
      data: {
        title: 'Cập nhật nhân viên',
        message: 'Bạn có chắc muốn cập nhật không ?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService
          .updateUser(this.updatedStaff.id, this.updatedStaff)
          .subscribe({
            next: (response: any) => {
              const dialogConfirm = this.dialog.open(DialogConfirmComponent, {
                width: '250px',
                data: {
                  title: 'Cập nhật nhân viên',
                  message: 'Cập nhật thành công',
                },
              });
              dialogConfirm.afterClosed().subscribe((result) => {
                if (result) {
                  this.getAllStaffs(
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
              debugger;
              alert(error.error);
              console.error('Error fetching staffs:', error);
            },
          });
      }
    });
  }
}
