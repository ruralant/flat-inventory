import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';

import { ApartmentService } from 'app/services/apartment.service';
import { Apartment } from './../common/interface/apartment';

@Component({
  selector: 'app-edit-apt',
  templateUrl: './edit-apt.component.html',
  styleUrls: ['./edit-apt.component.scss']
})
export class EditAptComponent implements OnInit {

  apartmentToBeModified: string;
  apartment: any = {};

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar
  ) { }

  async getApartment() {
    await this.route.params
      .subscribe((params: Params) => this.apartmentToBeModified = params['id']);
    await this.apartmentService.getOneApartment(this.apartmentToBeModified)
      .subscribe(response => this.apartment = response.apartments[0]);
  }

  ngOnInit() {
    this.getApartment();
  }

  apartmentUpdate(id: any) {
    this.apartmentService.editApartment(id, this.apartment)
      .subscribe(result => {
        if (result.apartment) {
          this.snackbar.open('The apartment has been modified.');
          this.location.back();
        } else {
          this.snackbar.open('Something went wrong!');
        }
      });
  }
}
