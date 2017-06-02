import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';
import { UserService } from 'app/user.service';

declare var UIkit: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';
  instance: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['/home']);
        } else {
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }
      });
  }

  forgotPassword() {
    const el = (<HTMLInputElement>document.querySelector('#email')).value;

    if (confirm(`Would you like password reset link sent for ${el}?`)) {
      this.userService.forgotPassword(el)
        .subscribe(result => {
          if (result === false) {
            UIkit.notification(`FAIL: No such user exists`, { status: 'warning' });
          } else {
            UIkit.notification(`SUCCESS: A password reset has been emailed to your account. Follow the instructions in the email`, { status: 'success' });
          }
        })
    }
  }

}

