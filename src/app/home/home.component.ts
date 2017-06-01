import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { ApartmentService } from '../apartment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUser: any;
  apartments: any = [];

  constructor(
    private userService: UserService,
    private apartmentService: ApartmentService
  ) { }

  getCurrentUser(): void {
    this.userService.getUser()
      .subscribe(currentUser => {
        this.currentUser = currentUser.user;
      })
  }

  getUserApartments(): void {
    this.apartmentService.getApartments()
      .subscribe(apartments => {
        this.apartments = apartments;
        console.log(this.apartments);
      })
  }


  ngOnInit() {
    this.getCurrentUser();
    this.getUserApartments();
  }

}
