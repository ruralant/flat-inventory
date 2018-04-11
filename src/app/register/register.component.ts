import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  data = {};

  constructor( private authService: AuthenticationService ) { }

  register() {
    this.authService.register(this.data)
      .subscribe(res => console.log(res));
  }

  ngOnInit() {
  }

}
