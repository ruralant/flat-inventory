import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatInput } from '@angular/material'
import { MatSnackBar } from '@angular/material'

import { AuthenticationService } from '../authentication.service'
import { UserService } from 'app/user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {}
  loading = false
  error = ''
  instance: any

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout()
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['/home'])
        } else {
          this.error = 'Username or password is incorrect'
          this.loading = false
        }
      })
  }

  forgotPassword() {
    const el = (<HTMLInputElement>document.querySelector('#email')).value

    if (confirm(`Would you like password reset link sent for ${el}?`)) {
      this.userService.forgotPassword(el)
        .subscribe(result => {
          if (result === false) {
            this.snackBar.open('FAIL: No such user exists')
          } else {
            this.snackBar.open('SUCCESS: A password reset has been emailed to your account. Follow the instructions in the email')
          }
        })
    }
  }

}

