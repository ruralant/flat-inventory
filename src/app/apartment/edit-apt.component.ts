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

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.apartmentService.getOneApartment(params['id']))
      .subscribe(result => this.apartmentToBeModified = result[0])
  }

  apartmentUpdate(id: any) {
    this.apartmentService.editApartment(id, this.apartmentToBeModified)
      .subscribe(result => {
        this.snackbar.open('The room has been modified.');
        this.location.back();
      }, err => {
        if (err.status === 400) {
          this.snackbar.open('Something went wrong!')
        }
      });
  }
}
