import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { User } from '../common/interface/user';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss'],
  providers: [UserService]
})

export class TopnavComponent implements OnInit {
  user: User;

  constructor( private userService: UserService ) { }

  ngOnInit() {
    this.userService.getUser()
      .subscribe((user: User) => this.user = user);
  }

}
