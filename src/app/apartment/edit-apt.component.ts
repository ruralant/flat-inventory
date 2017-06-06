import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { ApartmentService } from '../apartment.service';

declare var UIkit: any;

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
    private location: Location
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.apartmentService.getOneApartment(params['id']))
      .subscribe(result => {
        this.apartmentToBeModified = result[0];
      })
  }

  apartmentUpdate(id: any, f: NgForm) {
    this.apartmentService.editApartment(id, this.apartmentToBeModified)
    .subscribe(result => {
      // UIkit.notification(`SUCCESS: The apartment has been succesfully modified.`, { status: 'success' });
      this.location.back();
    }, err => {
      if (err.status === 400) {
        // UIkit.notification(`WARNING: The apartment has not been updated.`, { status: 'warning' });
      }
    });
  }
}
