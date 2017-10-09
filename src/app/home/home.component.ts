import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { ApartmentService } from '../apartment.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: any;
  apartments: any = [];
  newApartment: any = {}

  constructor(
    private userService: UserService,
    private apartmentService: ApartmentService,
    private itemService: ItemService,
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
      })
  }

  // createItem(): void {
  //   this.itemService.getItems()
  // }

  ngOnInit() {
    this.getCurrentUser();
    this.getUserApartments();
  }

}
