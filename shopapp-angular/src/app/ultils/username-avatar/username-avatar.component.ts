import { Component } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-username-avatar',
  templateUrl: './username-avatar.component.html',
  styleUrls: ['./username-avatar.component.scss'],
})
export class UsernameAvatarComponent {
  user: string = '';
  avatar: string = '';

  constructor(private userService: UserService) {}
}
