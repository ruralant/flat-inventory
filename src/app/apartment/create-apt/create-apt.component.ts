import { Component, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { ApartmentService } from 'app/services/apartment.service';
import { Apartment } from 'app/common/interface/apartment';

@Component({
  selector: 'app-create-apt',
  templateUrl: './create-apt.component.html',
  styleUrls: ['./create-apt.component.scss']
})
export class CreateAptComponent implements OnInit {

  newApartment: any = {};
  // output apartment after save
  apartments: Apartment[] = [];

  constructor(
    private apartmentService: ApartmentService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  createApartment(): void {
    this.apartmentService.createApartment(this.newApartment)
      .subscribe((apartment: Apartment) => {
        if (apartment) {
          this.snackbar.open('The apartment has been created.');
          this.apartmentService.getApartments()
            .subscribe((apartments: Apartment[]) => this.apartments = apartments);
        } else {
          this.snackbar.open('Something went wrong! The apartment has not been created');
        }
      });
  }
}
