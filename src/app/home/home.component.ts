import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { ApartmentService } from '../apartment.service';

declare var UIkit: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUser: any;
  apartments: any = [];
  newApartment: any = {}

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

  createApartment(): void {
    this.apartmentService.createApartment(this.newApartment)
    .subscribe(apartment => {
      UIkit.notification(`The apartment has been created.`, { status: 'success' });
    }), err => {
        if(err.status === 400) {
          UIkit.notification(`An error occurred. The apartment has not been created`, { status: 'warning' });
        }
      }
  }


  ngOnInit() {
    this.getCurrentUser();
    this.getUserApartments();
  }

}
