import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';

import { ApartmentService } from 'app/services/apartment.service';

@Component({
  selector: 'app-edit-apt',
  templateUrl: './edit-apt.component.html',
  styleUrls: ['./edit-apt.component.scss']
})
export class EditAptComponent implements OnInit {

  apartmentToBeModified: any = {};

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar
  ) { }

  getApartment(): void {
    this.route.paramMap
      .subscribe(params => this.apartmentToBeModified = params.get('id'));
  }

  ngOnInit() {
    this.getApartment();
  }

  apartmentUpdate(id: any) {
    this.apartmentService.editApartment(id, this.apartmentToBeModified)
      .subscribe(result => {
        if (result.apartment) {
          this.snackbar.open('The room has been modified.');
          this.location.back();
        } else {
          this.snackbar.open('Something went wrong!');
        }
      });
  }
}
