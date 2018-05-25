import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { UserService } from 'app/services/user.service';
import { ApartmentService } from '../services/apartment.service';
import { ItemService } from 'app/services/item.service';

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
    private snackbar: MatSnackBar
  ) { }

  getCurrentUser(): void {
    this.userService.getUser()
      .subscribe(result => this.currentUser = result.user);
  }

  getUserApartments(): void {
    this.apartmentService.getApartments()
      .subscribe(response => this.apartments = response.apartments);
  }

  deleteApartment(id): void {
    if (confirm('Are you sure you want to delete the apartment?')) {
      this.apartmentService.deleteApartment(id)
        .subscribe(result => {
          if (result.status === 'success') {
            this.snackbar.open('The apartment has been deleted.')
            this.getUserApartments();
          } else {
            this.snackbar.open('Something went wrong! The apartment has not been delete')
          }
        })
    }
  }

  ngOnInit() {
    this.getCurrentUser();
    this.getUserApartments();
  }

}
