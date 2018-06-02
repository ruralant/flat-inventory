import { Component, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { ApartmentService } from 'app/services/apartment.service';
import { Apartment } from './../common/interface/apartment';

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
      .subscribe(result => {
        if (result.apartment) {
          this.snackbar.open('The apartment has been created.');
          this.apartmentService.getApartments()
            .subscribe(rst => this.apartments = rst.apartments);
        } else {
          this.snackbar.open('Somthing went wrong! The apartment has not been created');
        }
      });
  }
}
