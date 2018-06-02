import { Component, OnInit } from '@angular/core';

import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss'],
  providers: [UserService]
})

export class TopnavComponent implements OnInit {
  user: any;

  constructor( private userService: UserService ) { }

  ngOnInit() {
    this.userService.getUser()
      .subscribe(user => this.user = user);
  }

}
