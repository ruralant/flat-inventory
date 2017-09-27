import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { SnackbarService } from '../snackbar.service';

import { ApartmentService } from '../apartment.service';

@Component({
  selector: 'app-edit-apt',
  templateUrl: './edit-apt.component.html',
  styleUrls: ['./edit-apt.component.css']
})
export class EditAptComponent implements OnInit {

  apartmentToBeModified: any = {};

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: SnackbarService
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.apartmentService.getOneApartment(params['id']))
      .subscribe(result => {
        this.apartmentToBeModified = result[0];
      })
  }

  apartmentUpdate(id: any) {
    this.apartmentService.editApartment(id, this.apartmentToBeModified)
      .subscribe(result => {
        this.snackbar.showSnackBar("The room has been modified.");              
        this.location.back();
      }, err => {
        if (err.status === 400) {
          this.snackbar.showSnackBar("Something went wrong!")          
        }
      });
  }
}
