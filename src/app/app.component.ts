import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  user: any;
  display = false;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    authenticationService.changeEmitted$.subscribe(change => {
      if (change === 'login') {
        this.getUser();
        this.display = true;
      } else if (change === 'logout') {
        this.display = false;
      } else if (change === 'updateUser') {
        this.getUser();
      }
    });
  }

  // get user info
  getUser() {
    this.authenticationService.getUser()
      .subscribe(user => {
        this.display = true;
        this.user = user;
        const theme = user.user.theme;
        document.documentElement.style.setProperty(`--base`, `var(--${theme}-theme-base)`);
        document.documentElement.style.setProperty(`--second`, `var(--${theme}-theme-second)`);
        document.documentElement.style.setProperty(`--third`, `var(--${theme}-theme-third)`);
        document.documentElement.style.setProperty(`--hint`, `var(--${theme}-theme-hint)`);
        document.documentElement.style.setProperty(`--text`, `var(--${theme}-theme-text)`);
        document.documentElement.style.setProperty(`--text-hint`, `var(--${theme}-theme-text-hint)`);
      });
  }

  ngOnInit() {
    this.getUser();
  }
}
