import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  data = {};

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  register() {
    this.authService.register(this.data)
      .subscribe(() => this.router.navigate(['/home']));
  }

  ngOnInit() {
  }

}
