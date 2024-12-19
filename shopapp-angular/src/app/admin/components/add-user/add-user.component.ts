import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { environment } from 'src/app/user/environments/environment';
import { UserService } from 'src/app/user/services/user.service';
import { Role } from 'src/app/user/models/role';
import { RoleService } from 'src/app/user/services/role.service';
import { InsertStaffDTO } from '../../dtos/insert.staff.dto';
import { RoleDTO } from '../../dtos/role.dto';
import { DialogConfirmComponent } from 'src/app/ultils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  user: string = '';
  avatar: string = '';
  roles: Role[] = [];
  insertStaffDTO: InsertStaffDTO = {
    full_name: '',
    phone_number: '',
    address: '',
    password: '',
    retype_password: '',
    is_active: 1,
    date_of_birth: new Date(),
    avatar: undefined,
    sex: 0,
    cic: '',
    email: '',
    role_id: 0,
  };
  role_name: string = '';
  image_url: string = '';

  @ViewChild('closeRole', { static: false }) closeRole: ElementRef | undefined;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    this.user = this.userService.getUserResponseFromLocalStorage()!.fullname;
    this.avatar = `${environment.apiBaseUrl}/users/avatar/${
      this.userService.getUserResponseFromLocalStorage()!.avatar
    }`;
    this.getRoles();
  }

  onFileChange(event: any) {
    debugger;
    // Retrieve selected files from input element
    const files = event.target.files;
    // Limit the number of selected files to 5
    if (files.length > 2) {
      alert('Please select a maximum of 2 images.');
      return;
    }
    this.image_url = URL.createObjectURL(files[0]);
    // Store the selected files in the newProduct object
    this.insertStaffDTO.avatar = files[0];
    debugger;
  }

  getRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        // Sử dụng kiểu Role[]
        debugger;
        this.roles = roles;
        this.roles.splice(0, 1);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error getting roles:', error);
      },
    });
  }

  createRole(): void {
    let roleDTO: RoleDTO = {
      role_name: this.role_name,
    };
    this.roleService.createRole(roleDTO).subscribe({
      next: (response: any) => {
        let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
          width: '250px',
          data: {
            title: 'Thêm chức vụ',
            message: 'Thêm thành công',
          },
        });
        dialogConfirm.afterClosed().subscribe((result) => {
          if (result) {
            this.renderer
              .selectRootElement(this.closeRole!.nativeElement)
              .click();
          }
        });
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.log(error.error);
        let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
          width: '250px',
          data: {
            title: 'Thêm chức vụ',
            message: 'Thêm thất bại',
          },
        });
        dialogConfirm.afterClosed().subscribe((result) => {
          if (result) {
            this.getRoles();
            this.renderer
              .selectRootElement(this.closeRole!.nativeElement)
              .click();
          }
        });
      },
    });
  }
  insertStaff() {
    this.userService.insertStaff(this.insertStaffDTO).subscribe({
      next: (response) => {
        debugger;
        if (this.insertStaffDTO.avatar != null) {
          const id = response.data.id; // Assuming the response contains the newly created product's ID
          this.userService
            .uploadImages(id, this.insertStaffDTO.avatar)
            .subscribe({
              next: (imageResponse) => {
                debugger;
                // Handle the uploaded images response if needed
                console.log('Images uploaded successfully:', imageResponse);
                let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
                  width: '250px',
                  data: {
                    title: 'Thêm nhân viên',
                    message: 'Thêm nhân viên thành công',
                  },
                });
                dialogConfirm.afterClosed().subscribe((result) => {
                  if (result) {
                    location.reload();
                  }
                });
              },
              error: (error) => {
                debugger;
                // Handle the error while uploading images
                alert(error.error);
                let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
                  width: '250px',
                  data: {
                    title: 'Thêm nhân viên',
                    message: 'Thêm nhân viên thất bại',
                  },
                });
                dialogConfirm.afterClosed().subscribe((result) => {
                  if (result) {
                    dialogConfirm.close();
                  }
                });
              },
            });
        } else {
          let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
            width: '250px',
            data: {
              title: 'Thêm nhân viên',
              message: 'Thêm nhân viên thành công',
            },
          });
          dialogConfirm.afterClosed().subscribe((result) => {
            if (result) {
              location.reload();
            }
          });
        }
      },
      error: (error) => {
        debugger;
        // Handle error while inserting the staff
        alert(error.error);
        console.error('Error inserting staff:', error);
        let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
          width: '250px',
          data: {
            title: 'Thêm nhân viên',
            message: 'Thêm nhân viên thất bại',
          },
        });
        dialogConfirm.afterClosed().subscribe((result) => {
          if (result) {
            dialogConfirm.close();
          }
        });
      },
    });
  }
}
